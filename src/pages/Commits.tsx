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
import { repoAtom } from "@/atoms/repo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface CommitProps {
  avatar_url?: string
  name?: string
  date?: string
  message?: string
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
  const [maxPage, setMaxPage] = useState(1);

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
      const octokit = new Octokit();

      const commits = await getTotalCommits(repo[0], repo[1]);
      setMaxPage(Math.ceil(commits / 10));

      const { data } = await octokit.request("GET /repos/{owner}/{repo}/commits", {
        owner: repo[0],
        repo: repo[1],
        per_page: 10,
        page,
      });

      console.log(data);

      const res = data.map((item: any) => {
        return {
          avatar_url: item.author.avatar_url,
          name: item.commit.author.name,
          date: dayjs(item.commit.author.date).format("YYYY/MM/DD"),
          message: item.commit.message.split("Co-authored-by")[0],
        };
      });

      setCommits(res);
    }

    getCommits();
  }, [repo, page]);

  return (
    <div className="rounded-md border flex-1 flex flex-col">
      <Table>
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
              <TableRow key={index}>
                <TableCell className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={commit.avatar_url} />
                    <AvatarFallback>{commit.name}</AvatarFallback>
                  </Avatar>
                  {commit.name}
                </TableCell>
                <TableCell>{commit.message}</TableCell>
                <TableCell>{commit.date}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
      <div className="flex-1 flex items-center gap-4 px-8 py-4 border-t">
        <Button className="mr-auto">Revert</Button>
        <Button disabled={page === 1} onClick={() => handlePageChange(false)}>Prev</Button>
        <p>{page} / {maxPage}</p>
        <Button disabled={page === maxPage} onClick={() => handlePageChange(true)}>Next</Button>
      </div>
    </div>
  );
}

export default Commits;
