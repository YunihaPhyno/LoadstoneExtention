using UnityEngine;
using System.Collections;
using System.Text.RegularExpressions;


public class GitController : CommandProcessBase
{
    string currentBranchName;
    string[] branchNames;

    public GitController(string gitDirectory) : base(gitDirectory){}

    public string GetCurrentBranchName()
    {
        log.d("GitController.GetCurrentBranchName()");
        UpdateBranchNames();
        return currentBranchName;
    }

    public void UpdateBranchNames() {
        log.d("GitController.GetBranchNames()");
        string stdout = Exec("git branch");
        branchNames = stdout.Split('\n');
        for(int i = 0; i < branchNames.Length; i++)
        {
            if (Regex.IsMatch(branchNames[i], @"\*"))
            {
                branchNames[i] = Regex.Replace(branchNames[i], @"\* (.*)", "$1");
                currentBranchName = branchNames[i];
            }
        }
        log.d(branchNames);
    }

    public string[] GetBranchNames()
    {        
        UpdateBranchNames();
        return branchNames;
    }

    public string Status()
    {
        return Exec("git status");
    }

    public string Pull()
    {
        return Exec("git pull");
    }

    public string Push()
    {
        return Exec("git push");
    }

    public string Add(string[] filenames)
    {
        Exec("git status");
        return "add files(未実装)";
        //return Exec("git Add");
    }
}
