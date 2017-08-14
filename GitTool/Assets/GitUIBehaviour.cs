using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using System.Text.RegularExpressions;

public class GitUIBehaviour : MonoBehaviour
{
    GitController git;
    string[] modifiedFileNames;
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
        UpdateModifiedFiles();
        git.Add(modifiedFileNames);
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

        if (logPageNum == git.GetNumOffsets() - 1)
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
    public void UpdateModifiedFiles()
    {
        log.d("GitController.UpdateModifiedFiles()");
        git.Status();
        string status = git.GetCommandlineLog();
        MatchCollection matches = Regex.Matches(status, "modified:.*\n");
        modifiedFileNames = new string[matches.Count];

        for (int i = 0; i < matches.Count; i++)
        {
            modifiedFileNames[i] = Regex.Replace(matches[i].Value, @"modified:\s*(\S+)\n", "$1");
        }
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
