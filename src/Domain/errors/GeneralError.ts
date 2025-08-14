import { ErrorCodes } from "../../Shared/constants/ErrorCodes";

export type GeneralErrorType = {
  type: string;
  code: ErrorCodes;
  message: string;
  stackTracerError?: string; // opcional, pode ser preenchido manualmente
};

export class GeneralError{
  public readonly type: string;
  public readonly code: ErrorCodes;
  public readonly stackTracerError?: string;
  public readonly message: string;
  public readonly name: string;
  public readonly stack: string;

  constructor(args: GeneralErrorType) {
    // Corrige o nome do erro para a classe atual
    this.name = new.target.name;
    this.type = args.type;
    this.code = args.code;
    this.message = args.message.replace("{type}", args.type).replace("{code}", args.code);
    this.stackTracerError = args.stackTracerError ?? this.stack;

    // Garante stack trace limpa no Node.js
    if (Error.captureStackTrace) { Error.captureStackTrace(this, this.constructor); }
  }
}
