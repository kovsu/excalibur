import { useState } from "react";
import { useAtom } from "jotai";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { repoAtom } from "@/atoms/repo";

function SearchInput() {
  const [repoLink, setRepoLink] = useState("");
  const { toast } = useToast();
  const [, setRepo] = useAtom(repoAtom);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRepoLink(e.target.value);
  };

  const handleSubmit = () => {
    const githubURL = "https://github.com/";

    if (!repoLink.startsWith(githubURL)) {
      toast({
        title: "Invalid URL",
        description: "Please input a valid GitHub repository URL.",
      });
      return;
    }
    const info = repoLink.replace(githubURL, "").split("/");
    setRepo(info);

    toast({
      title: "Turn to the next page",
      description: `Owner: ${info[0]}\nRepository: ${info[1]}`,
    });
  };

  return (
    <>
      <p className="text-3xl leading-10 pt-4 pb-8">
        Search for the <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-pink-600">detailed information</span> of a GitHub repository<br />
        and start learning from its <span className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-teal-600">initial commit.</span>
      </p>
      <div className="flex items-center gap-4 w-rose">
        <Input placeholder="Please input GitHub repo link..." className="bg-transparent" value={repoLink} onChange={e => handleInput(e)} />
        <Button onClick={handleSubmit}>Search</Button>
      </div>
    </>
  );
}

export default SearchInput;
