using UnityEngine;
using System.Collections;

public class CommandProcessBase
{
    System.Diagnostics.Process process;

    //参考 https://dobon.net/vb/dotnet/process/standardoutput.html
    protected CommandProcessBase(string workingDirectory)
    {
        log.d("CommandProcessBase.CommandProcessBase()");
        //Processオブジェクトを作成
        process = new System.Diagnostics.Process();

        //ComSpec(cmd.exe)のパスを取得して、FileNameプロパティに指定
        process.StartInfo.FileName = System.Environment.GetEnvironmentVariable("ComSpec");
        
        //ディレクトリの指定
        process.StartInfo.WorkingDirectory = workingDirectory;

        //出力を読み取れるようにする
        process.StartInfo.UseShellExecute = false;
        process.StartInfo.RedirectStandardOutput = true;
        process.StartInfo.RedirectStandardInput = false;

        //ウィンドウを表示しないようにする
        process.StartInfo.CreateNoWindow = false; //true;
    }

    protected string Exec(string command)
    {
        log.d("CommandProcessBase.Exec(" + command + ")");

        //コマンドラインを指定（"/c"は実行後閉じるために必要）
        process.StartInfo.Arguments = @"/c " + command;

        process.Start();

        //出力を読み取る
        string result = process.StandardOutput.ReadToEnd();

        process.WaitForExit();
        process.Close();

        log.d("result : " + result);
        return result;
    }
}
