using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using System.Text.RegularExpressions;

public class GitUIBehaviour : MonoBehaviour
{
    GitController git;

    public class FileStatus
    {
        public enum Status {
            NONE,
            MODIFIED,
            DELETED,
            UNTRACKED,
        }

        public Status status = Status.NONE;

        public string filePath = "";
        public string GetFileName()
        {
            return Regex.Match(filePath,@"(.*/)+([a-zA-Z]+.*$)").Value;
        }
    }

    FileStatus[] stagedFiles;
    FileStatus[] notStagedFiles;
    FileStatus[] untrackedFiles;

    int logPageNum = 0;

    string currentBranchName;
    string[] branchNames;

    //For DEBUG
#if UNITY_STANDALONE_WIN
	string gitDirectory = "C:\\Users\\Yuniha\\Desktop\\LoadstoneExtention";
#elif UNITY_STANDALONE_OSX
	string gitDirectory = "/Users/a-tatsuno/robkr";
#endif
	//public string gitDirectory;

	public Text resultTextArea;
	public Text branchTextArea;
    public Button prevButton;
    public Button nextButton;

	void Awake()
	{
		git = new GitController(gitDirectory);
        UpdateBranchNames();
		branchTextArea.text = "Branch : " + currentBranchName;
		OnPushStatusButton();

        //for debug
        UpdateFileLists();
	}

	public void OnPushStatusButton()
	{
        git.Status();
        UpdateLog(0);
	}

	public void OnPushPullButton ()
	{
        git.Pull();
        UpdateLog(0);
	}

	public void OnPushPushButton()
	{
        git.Push();
        UpdateLog(0);
	}

    public void OnPushAddAllButton()
    {
        UpdateFileLists();
        //git.Add(modifiedFileNames);
        git.Status();
        UpdateLog(0);
    }

    void UpdateLog(int offset)
    {
        resultTextArea.text = git.GetCommandlineLog(offset);
        logPageNum = offset;
        UpdatePageButtons();
    }

    void UpdatePageButtons()
    {
        if (logPageNum == 0)
        {
            nextButton.interactable = false;
        }
        else
        {
            nextButton.interactable = true;
        }

        if (logPageNum == git.GetNumOffsets())
        {
            prevButton.interactable = false;
        }
        else
        {
            prevButton.interactable = true;
        }
    }

    public void OnPushPrevButton()
    {
        if (logPageNum < git.GetNumOffsets())
        {
            UpdateLog(logPageNum + 1);
        }
    }

    public void OnPushNextButton()
    {
        if (logPageNum > 0)
        {
            UpdateLog(logPageNum - 1);
        }
    }

    // git statusから入手した変更のあるファイルを保存する
    public void UpdateFileLists()
    {
        log.d("GitController.UpdateModifiedFiles()");
        git.Status("-s");
        string status = git.GetCommandlineLog();

        stagedFiles = GetFileStatusList(status, @"[MD]\s\s\S+\n");
        notStagedFiles = GetFileStatusList(status, @"\s[MD]\s\S+\n");
        untrackedFiles = GetFileStatusList(status, @"\?\?\s\S+\n");
    }

    public static FileStatus[] GetFileStatusList(string gitStatusLog, string regex)
    {
        MatchCollection stagedLog = Regex.Matches(gitStatusLog, regex);
        FileStatus[] files = new FileStatus[stagedLog.Count];
        for (int i = 0; i < stagedLog.Count; i++)
        {
            FileStatus file = new FileStatus();
            file.filePath = stagedLog[i].Value.Substring(3, stagedLog[i].Value.Length - 4);
            if (stagedLog[i].Value[0] == 'M' || stagedLog[i].Value[1] == 'M')
            {
                file.status = FileStatus.Status.MODIFIED;
            }

            else if (stagedLog[i].Value[0] == 'D' || stagedLog[i].Value[1] == 'D')
            {
                file.status = FileStatus.Status.DELETED;
            }

            else if (stagedLog[i].Value[0] == '?')
            {
                file.status = FileStatus.Status.UNTRACKED;
            }

            files[i] = file;
        }
        return files;
    }

    // ブランチ更新
    public void UpdateBranchNames()
    {
        log.d("GitController.GetBranchNames()");
        git.Branch();
        string stdout = git.GetCommandlineLog();
        branchNames = stdout.Split('\n');
        for (int i = 0; i < branchNames.Length; i++)
        {
            if (Regex.IsMatch(branchNames[i], @"\*"))
            {
                branchNames[i] = Regex.Replace(branchNames[i], @"\* (.*)", "$1");
                currentBranchName = branchNames[i];
            }
        }
        log.d(branchNames);
    }

}
