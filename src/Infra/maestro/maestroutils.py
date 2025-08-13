import requests
import uuid
import os
import base64
import json
from datetime import datetime, timedelta
from typing import List, Dict, Any

class WorkDay():
  def __init__(
    self,
    date_start: datetime = datetime.now(),
    holidays: List[str] = [],
    weekdays: Dict[int, dict] = {},
    force_time_work: bool = False,
    spindle: int = 0 # Fuso horário, caso necessário. O horário padrão é UTC (Global)
  ):
    self.date_start = date_start
    self.holidays = holidays  # Ex: ["01-01", "25-12"] ou ["01-01-2011", "25-12-2011"] 
    self.weekdays = weekdays  # Ex: {0: {"hour_initial": "09:00", "hour_final": "18:00"}, ...} Padrão de semanas da lib datetime (0 == segunda)
    self.force_time_work = force_time_work
    self.spindle = spindle
    self.valid_params()

  def valid_params(self):
    if not isinstance(self.date_start, datetime): raise TypeError("date_start deve ser datetime")
    if not isinstance(self.holidays, list) and not isinstance(self.holidays[0], str): raise TypeError("holidays deve ser uma lista de datas")
    if not isinstance(self.weekdays, dict): raise TypeError("weekdays deve ser um dicionário")

  def format_date_holidays(self): return set(holiday[:5] for holiday in self.holidays) # Formata para dia e mês 
  def is_holiday(self, date: datetime, holidays_set: set) -> bool: return date.strftime("%d-%m") in holidays_set
  def is_valid_weekday(self, date: datetime) -> bool: return date.weekday() in self.weekdays


  # No caso do force_work_time == True, ele irá ajustar a hora para estar dentro da jornada de trabalho.
  def adjust_time_if_needed(self, date: datetime, weekday_config: Dict[str, str]) -> datetime:
    hour_initial = (datetime.strptime(weekday_config["hour_initial"], "%H:%M") + timedelta(hours=self.spindle)).time() 
    hour_final = (datetime.strptime(weekday_config["hour_final"], "%H:%M") + timedelta(hours=self.spindle)).time()

    if date.time() < hour_initial: return date.replace(hour=hour_initial.hour, minute=hour_initial.minute, second=0)
    elif date.time() > hour_final: return date.replace(hour=hour_final.hour, minute=hour_final.minute, second=0)

    return date

  # Valida se o dia enviado é um dia útil
  def date_is_work(self, date: datetime) -> bool:
    self.valid_params()
    if not self.is_valid_weekday(date): return False
    if self.is_holiday(date, self.format_date_holidays()): return False
    
    return True

  # Captura o próximo dia útil com base na data enviada por parametro.
  def get_next_work_day(self, date_default: datetime = None) -> Dict[str, any]:
    date_origen = self.date_start
    if date_default: 
      date_origen = date_default
    
    
    response = {
      "success": "false",
      "date_start": date_origen.strftime("%d-%m-%Y %H:%M:%S")
    }
    for i in range(1, 31):  # Busca no máximo 30 dias à frente
      next_work_day = date_origen + timedelta(days=i, hours=self.spindle)
      if not self.date_is_work(next_work_day): continue

      weekday_config = self.weekdays[next_work_day.weekday()]
      if self.force_time_work: next_work_day = self.adjust_time_if_needed(next_work_day, weekday_config)

      # Se a hora inicial for < que a data atual, consequentemente quer dizer que a data atual é maior ou igual, o que entra na próxima validação
      # Se a data atual for > que a hora final ele continua, se não quer dizer que está dentro do range (igual)
      elif not (weekday_config["hour_initial"] < next_work_day.strftime("%H:%M") < weekday_config["hour_final"]): continue # < < realiza a mesma função do operador lógico &

      response["next_work_day"] = next_work_day.strftime("%d-%m-%Y %H:%M:%S")
      response["success"] = "true"
      break
    
    response["count_work_days"] = i
    return response

  def get_next_work_day_after_of(self, after_days: int = 1, date_default: datetime = None) -> Dict[str, any]:
    date_origen = timedelta(days=after_days)
    if date_origen: 
      date_origen = date_default
      
    result = self.get_next_work_day(date_origen)
    result[f"next_date_after_days"] = (date_origen).strftime("%d-%m-%Y %H:%M:%S")
    return result
  
  def formatWeekHours(self, value: dict):
    import json
    
    t_weekends = value.get("TSemanaHoras", {})
    business_works = {}
    weekdays = [6,0,1,2,3,4,5]

    for i in range(1, 8): # Semanas na Desk Manager iniciam no 1 (Domingo)
      
      if t_weekends.get(f"Semana{i}ativo", "") == "on":
        weekend_hour_1 = json.loads(t_weekends.get(f"Semana{i}hora{1}"))[0]
        weekend_hour_2 = json.loads(t_weekends.get(f"Semana{i}hora{2}"))[0]
        key_weekend_hour_1 = [k for k in weekend_hour_1.keys()][0]
        key_weekend_hour_2 = [k for k in weekend_hour_2.keys()][0]
        week = {
          weekdays[i-1]: {
            # Padronização do formato da jornada de trabalho, assim podemos adicionar jornadas de trabalho de outros lugares além da DM
            "hour_initial": weekend_hour_1[f"{key_weekend_hour_1}"],
            "hour_final": weekend_hour_2[f"{key_weekend_hour_2}"],
            "break_hour": {
              "init": t_weekends.get(f'Repouso{i}Hora{1}'),
              "finished": t_weekends.get(f"Repouso{i}Hora{2}")
            }
          }
        }
        business_works.update(week)

    return business_works
  
  def calculate_working_days(self, date_default=None):
    self.valid_params()
    # Sempre irá levar em consideração a data atual
    end = datetime.now()
    current_day = date_default if date_default else self.date_start
    total_days = 0

    if end <= current_day: 
      return {"days_counted": 0}
    while current_day.date() <= end.date():
      current_day += timedelta(days=1)
     
      if self.date_is_work(current_day) and end.time() >= current_day.time():
        total_days += 1

    return {"days_counted": total_days}


  def count_work_minutes(self, start: datetime, end: datetime) -> int:
    minutes = 0
    current = start

    while current < end:
      if self.date_is_work(current):
        weekday_conf = self.weekdays[current.weekday()]
        hour_initial = datetime.strptime(weekday_conf["hour_initial"], "%H:%M").time()
        hour_final = datetime.strptime(weekday_conf["hour_final"], "%H:%M").time()

        work_start = datetime.combine(current.date(), hour_initial)
        work_end = datetime.combine(current.date(), hour_final)

        # Corrige início e fim para o range atual
        range_start = max(current, work_start)  # Converte a data atual para a próxima hora útil inicial
        range_end = min(end, work_end) # Converte a data final para a próxima hora útil final 

        if range_start < range_end:
          delta = (range_end - range_start).total_seconds() / 60
          minutes += delta

      current += timedelta(days=1)
      current = current.replace(hour=0, minute=0, second=0) # Altera para as 00:00:00 para pegar a próxima hora útil 8:00

    return int(minutes)

  def calculate_percent_days(self, date_default: datetime = None, days_to_100: int = 1):
    self.valid_params()
    date_start = date_default if date_default else self.date_start
    date_now = datetime.now() + timedelta(hours=self.spindle)
    date_end = date_start + timedelta(days=days_to_100)

    while not self.date_is_work(date_end): 
      date_end += timedelta(days=1)
      
    total_minutes_100 = self.count_work_minutes(date_start, date_end)
    worked_minutes = self.count_work_minutes(date_start, min(date_now, date_end))

    percent = (worked_minutes / total_minutes_100) * 100 if total_minutes_100 else 0
    days = worked_minutes // (60 * 24) # // = retorno da parte inteira da divisão
    hours = (worked_minutes % (60 * 24)) // 60
    minutes = worked_minutes % 60

    return {
      "percent": percent,
      "total_days": f"{days}d {hours}h e {minutes}m"
    }    

def jsonValid(s):
    ss = s
    bok = False
    ipos = 0
    while not(bok) and ipos < len(ss):
        try:
            j = json.loads(ss, strict = False)
            bok = True
        except json.JSONDecodeError as e:
            ipos = e.pos
            
            if (ss[ipos] == '\\'):
                ss = ss[:ipos]+'\\'+ss[ipos:]
            elif (ss[ipos-1] == '"'):
                ss = ss[:ipos-1]+'\\'+ss[ipos-1:]
            elif (ss[ipos-2] == '"'):
                ss = ss[:ipos-2]+'\\'+ss[ipos-2:]
            elif (ss[ipos-3] == '"'):
                ss = ss[:ipos-3]+'\\'+ss[ipos-3:]
            else:
                j = {}
                break

    return ss

def downloadFile(sUrl):
    response = requests.get(sUrl)
    sfile, sextension = os.path.splitext(sUrl)
    sfile ='/tmp/'+str(uuid.uuid4())+sextension
    if response.status_code == 200:
        f = open(sfile, "w")
        f.write(response.text)
        f.close()
    else:
        sfile = response.content.decode()
        
    return sfile

def downloadFileBytes(sUrl):
    response = requests.get(sUrl, stream=True)
    sfile, sextension = os.path.splitext(sUrl)
    sfile ='/tmp/'+str(uuid.uuid4())+sextension

    if response.status_code == 200:
        f = open(sfile, "wb")
        f.write(response.content)
        f.close()
    else:
        sfile = 'Fail Download File!'
        
    return sfile



def downloadFileName(sUrl, sName):
    response = requests.get(sUrl)
    sfile ='/tmp/'+sName
    if response.status_code == 200:
        f = open(sfile, "w")
        f.write(response.text)
        f.close()
    else:
        sfile = response.content.decode()
        
    return sfile


def downloadFileBase64(sUrl):
    response = requests.get(sUrl)
    if response.status_code == 200:
        return base64.b64encode(response.content)
    else:
        return ''

def fileBase64(sFile):
    with open(sFile, "rb") as ofile:
        data = base64.b64encode(ofile.read())
    
    return data.decode()
    
def tokenMaestro():
  import json
  return json.dumps("q431431312eQWIIQWE123412DSE13412312FASGasfew")  #APENAS PARA TESTE NÃO FUNCIONA !  

def apiDeskManager(
  spath='',
  sbody='',
  smethod='POST',
  headers={},
  surl='https://api.desk.ms',
  staticip='',
  force_str = False
  ) -> Dict[str, Any]:
  import requests
  import json
  import sys

  url = f"{surl.rstrip('/')}/{spath.lstrip('/')}"
  try:
    data = sbody
    if(not force_str): data = json.loads(sbody)
   
    response = requests.request(
      method=smethod.upper(),
      url=url,
      headers=headers,
      json=data,
      timeout=10
    )

    response.encoding = "utf-8"

    try:
      response_json = json.loads(response.text.strip())
      response_json = decode_percent_encoded(response_json)
    except Exception as e:
      _, _, exc_tb = sys.exc_info()
      response_json = {
        "error": f"Erro {e} na linha: {exc_tb.tb_lineno}"
      }

    return {
      "status_code": response.status_code,
      "responsejson": response_json,
      "response": response.text.strip()
    }

  except Exception:
    return {
      "status_code": 400,
      "responsejson": {},
      "response": ""
    }

def decode_percent_encoded(data):
  from urllib.parse import unquote_plus

  if isinstance(data, dict):
    return {k: decode_percent_encoded(v) for k, v in data.items()}
  elif isinstance(data, list):
    return [decode_percent_encoded(item) for item in data]
  elif isinstance(data, str):
    return unquote_plus(data)
  else:
    return data
  
class Storage:
  key = ''
  value = '{}'
  
  def __init__(self):
    self.__storage = []
    self.__path_file = self.__path_file = r'/Library/Frameworks/Python.framework/Versions/3.13/lib/python3.13/site-packages/storage.json'

    # Cria o arquivo JSON se não existir
    if not os.path.exists(self.__path_file):
      with open(self.__path_file, 'w') as file:
        json.dump([], file)

  def Save(self):
    with open(self.__path_file, 'r') as file:
      if os.path.getsize(self.__path_file) > 0: self.__storage = json.load(file)
      else: self.__storage = []

    # Verifica se a chave já existe e atualiza o valor
    for item in self.__storage:
      if self.key in item:
        item[self.key] = self.value
        break
    else:
      # Se a chave não existir, adiciona um novo item
      self.__storage.append({self.key: self.value})
    
    # Salva o estado atualizado no arquivo
    with open(self.__path_file, 'w') as file:
      json.dump(self.__storage, file)

    return {"success": "true"}



  def Get(self):
    # Lê o conteúdo do arquivo
    with open(self.__path_file, 'r') as file:
      self.__storage = json.loads(file.read())  # Corrigido: lê o conteúdo do arquivo antes de carregar o JSON
    
    # Procura a chave no armazenamento
    for item in self.__storage:
      if self.key in item:
        return {"success": "true", "value": item[self.key]}
    
    return {"success": "false", "value": "{}"}


  def Delete(self):
    # Lê o conteúdo do arquivo
    with open(self.__path_file, 'r') as file:
      self.__storage = json.loads(file.read())  # Corrigido: lê o conteúdo do arquivo antes de carregar o JSON
    
    # Procura a chave e remove o item correspondente
    for item in self.__storage:
      if self.key in item:  # Corrigido: usar a variável `key` passada como argumento
        self.__storage.remove(item)
        
        # Salva o estado atualizado no arquivo
        with open(self.__path_file, 'w') as file:
          json.dump(self.__storage, file)  # Corrigido: utiliza json.dump para salvar o arquivo
        
        return "Storage deleted with success!"
  
    return "Storage not found!"