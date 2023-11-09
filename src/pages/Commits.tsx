import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { Octokit } from "octokit";
import dayjs from "dayjs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { repoAtom } from "@/atoms/repo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface CommitProps {
  avatar_url?: string
  name?: string
  date?: string
  message?: string
  html_url?: string
}

async function getTotalCommits(owner: string, repo: string) {
  const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1&page=1`);

  if (!response.ok)
    throw new Error(`GitHub API responded with status ${response.status}`);

  const linkHeader = response.headers.get("Link");
  const lastPageMatch = linkHeader!.match(/page=(\d+)>; rel="last"/);

  if (!lastPageMatch)
    throw new Error("Cannot determine total commits from the Link header");

  return parseInt(lastPageMatch[1], 10);
}

function Commits() {
  const [repo] = useAtom(repoAtom);
  const [commits, setCommits] = useState<CommitProps[]>([]);
  const [page, setPage] = useState(1);
  const [maxPage, setMaxPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [revert, setRevert] = useState(false);

  function handlePageChange(next: boolean) {
    if (!next)
      setPage(page - 1);
    else
      setPage(page + 1);
  }

  useEffect(() => {
    if (repo.length === 0) {
      window.location.href = "/";
      return;
    }

    async function getCommits() {
      let pageNum = 1;
      const octokit = new Octokit();
      setLoading(true);

      if (maxPage === 0) {
        const commits = await getTotalCommits(repo[0], repo[1]);
        setMaxPage(Math.ceil(commits / 10));
      }

      if (revert)
        pageNum = maxPage - page + 1;
      else
        pageNum = page;

      const { data } = await octokit.request("GET /repos/{owner}/{repo}/commits", {
        owner: repo[0],
        repo: repo[1],
        per_page: 10,
        page: pageNum,
      });

      const res = data.map((item: any) => {
        return {
          avatar_url: item.author ? item.author.avatar_url : "https://avatars.githubusercontent.com/u/67543980?v=4",
          name: item.commit.author.name,
          date: dayjs(item.commit.author.date).format("YYYY/MM/DD"),
          message: item.commit.message.split("\n\n")[0],
          html_url: item.html_url,
        };
      });

      setCommits(revert ? res.reverse() : res);
      setLoading(false);
    }

    getCommits();
  }, [repo, page, revert]);

  function toGithubPage(url: string) {
    window.open(url, "_blank");
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className={`flex-1 ${loading ? "flex justify-center items-center" : ""}`}>
        <Table loading={loading}>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead>PR Description</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              commits.map((commit, index) => (
                <TableRow key={index} onClick={() => toGithubPage(commit.html_url!)}>
                  <TableCell className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={commit.avatar_url} />
                      <AvatarFallback>{commit.name}</AvatarFallback>
                    </Avatar>
                    {commit.name}
                  </TableCell>
                  <TableCell className="">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <p className="text-start">{commit.message}</p>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{commit.message}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  </TableCell>
                  <TableCell>{commit.date}</TableCell>
                </TableRow>
              ))
          }
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center gap-4 py-4">
        <Button className="mr-auto" onClick={() => setRevert(!revert)}>Revert</Button>
        <Button disabled={page === 1} onClick={() => handlePageChange(false)}>Prev</Button>
        <p>{page} / {maxPage}</p>
        <Button disabled={page === maxPage} onClick={() => handlePageChange(true)}>Next</Button>
      </div>
    </div>
  );
}

export default Commits;
