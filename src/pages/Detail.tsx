import { useAtom } from "jotai";
import { useEffect, useState } from "react";
import { Octokit } from "octokit";
import dayjs from "dayjs";
import { useDarkMode } from "usehooks-ts";
import { useNavigate } from "react-router-dom";
import { repoAtom } from "@/atoms/repo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface DetailProps {
  owner: string
  repo: string
  owner_avatar?: string
  created_at?: string
  updated_at?: string
}

function Detail() {
  const [repo] = useAtom(repoAtom);
  const [details, setDetails] = useState<DetailProps>({
    owner: repo[0],
    repo: repo[1],
  });
  const { isDarkMode } = useDarkMode();
  const navigate = useNavigate();

  useEffect(() => {
    async function getDetail() {
      if (repo.length === 0) {
        window.location.href = "/";
        return;
      }

      const octokit = new Octokit();
      const { data } = await octokit.request("GET /repos/{owner}/{repo}", {
        owner: repo[0],
        repo: repo[1],
      });

      setDetails({
        ...details,
        owner_avatar: data.owner.avatar_url,
        created_at: dayjs(data.created_at).format("YYYY/MM/DD"),
        updated_at: dayjs(data.updated_at).format("YYYY/MM/DD"),
      });
    }

    getDetail();
  }, [repo]);

  return (
    <div className="flex-1">
      <div className="flex flex-col gap-4">
        <p className="text-4xl font-bold">{details.repo}</p>
        <div className="flex gap-2 items-center">
          <Avatar className="w-8 h-8">
            <AvatarImage src={details.owner_avatar} />
            <AvatarFallback>{details.owner}</AvatarFallback>
          </Avatar>
          <p className="text-xl">{details.owner}</p>
          <Button className="text-sm ml-auto" onClick={() => navigate(-1)}>Back</Button>
        </div>
        <div className="flex items-center gap-4">
          <p className="font-italy">Created at <span className="font-bold">{details.created_at}</span></p>
          <p className="font-italy">Updated at <span className="font-bold">{details.updated_at}</span></p>
        </div>
        <div className="flex items-center justify-center">
          <img src={`https://api.star-history.com/svg?repos=${details.owner}/${details.repo}&type=Date&theme=${isDarkMode ? "dark" : ""}`} alt="" />
        </div>
      </div>
    </div>
  );
}

export default Detail;
