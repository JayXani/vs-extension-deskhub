export const showMessage = (typeMessage: string, message: string, vscode: any) => {
    if (vscode) {
        if (typeMessage.includes("warning")) { return vscode.window.showWarningMessage(message); }
        if (typeMessage.includes("information")) { return vscode.window.showInformationMessage(message); }
    }
    console.log(message);
    return;
};
