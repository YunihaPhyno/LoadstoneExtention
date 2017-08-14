using UnityEngine;
using System.Collections;
using System.Text.RegularExpressions;


public class GitController : CommandProcessBase
{
    // constructor
    public GitController(string gitDirectory) : base(gitDirectory) {}

    public void Status(string options = "")
    {
        Exec("git status " + options);
    }

    public void Pull()
    {
        Exec("git pull");
    }

    public void Push()
    {
        Exec("git push");
    }

    public void Add(string[] filenames)
    {
        string command = "git add ";
        for (int i = 0; i < filenames.Length; i++)
        {
            command += " " + filenames[i];
        }
        Exec(command);
    }

    public void Branch()
    {
        Exec("git branch");
    }



    
}
