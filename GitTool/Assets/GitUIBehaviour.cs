using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using System.Text.RegularExpressions;

public class GitUIBehaviour : MonoBehaviour {
	GitController git;

	//public string gitDirectory = "C:\\Users\\Yuniha\\Desktop\\LoadstoneExtention";
	string gitDirectory = "/Users/a-tatsuno/robkr";
	//public string gitDirectory;

	public Text resultTextArea;
	public Text branchTextArea;

	void Awake()
	{
		git = new GitController(gitDirectory);
		branchTextArea.text = "Branch : " + git.GetCurrentBranchName();
		OnPushStatusButton();        
	}

	public void OnPushStatusButton()
	{
		string stdout = git.Status();
		resultTextArea.text += stdout;
	}

	public void OnPushPullButton ()
	{
		resultTextArea.text += git.Pull();
	}

	public void OnPushPushButton()
	{
		resultTextArea.text += git.Push();
	}
}
