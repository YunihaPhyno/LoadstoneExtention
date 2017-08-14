using UnityEngine;
using System.Collections;

public class CommandProcessBase
{
    System.Diagnostics.Process process;

    int tail = -1;
    string[] logs = new string[100];

    //参考 https://dobon.net/vb/dotnet/process/standardoutput.html
    protected CommandProcessBase(string workingDirectory)
    {
		log.d("CommandProcessBase.CommandProcessBase(" + workingDirectory + ")");
        //Processオブジェクトを作成
        process = new System.Diagnostics.Process();

        
		#if UNITY_STANDALONE_WIN
		//ComSpec(cmd.exe)のパスを取得して、FileNameプロパティに指定
        process.StartInfo.FileName = System.Environment.GetEnvironmentVariable("ComSpec");
		#elif UNITY_STANDALONE_OSX
		process.StartInfo.FileName = "/bin/bash";
		#endif

        //ディレクトリの指定
        process.StartInfo.WorkingDirectory = workingDirectory;

        //出力を読み取れるようにする
        process.StartInfo.UseShellExecute = false;
        process.StartInfo.RedirectStandardOutput = true;
        process.StartInfo.RedirectStandardInput = false;

        //ウィンドウを表示しないようにする
        process.StartInfo.CreateNoWindow = false; //true;
    }

    protected void Exec(string command)
    {
        log.d("CommandProcessBase.Exec(\"" + command + "\")");
        
		#if UNITY_STANDALONE_WIN
		//コマンドラインを指定（"/c"は実行後閉じるために必要）
        process.StartInfo.Arguments = @"/c " + command;
		#elif UNITY_STANDALONE_OSX
		process.StartInfo.Arguments = "-c \" " + command + " \"";
		#endif

		log.d("command : " + process.StartInfo.Arguments);
        process.Start();

        //出力を読み取る
        AddLog("$ " + command + "\n" + process.StandardOutput.ReadToEnd());

        process.WaitForExit();
        process.Close();
    }

    void AddLog(string stdout)
    {
        tail++;
        logs[tail % logs.Length] = stdout;
    }

    public string GetCommandlineLog(int offset = 0)
    {
        return logs [(tail - offset) % logs.Length];
    }

    public int GetNumOffsets()
    {
        if (tail < logs.Length)
        {
            return tail;
        }

        return logs.Length;
    }
}
