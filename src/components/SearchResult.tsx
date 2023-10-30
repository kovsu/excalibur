import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { repoAtom } from "@/atoms/repo";
import { toast } from "@/components/ui/use-toast";

function SearchResult() {
  const [repo] = useAtom(repoAtom);
  const navigate = useNavigate();

  const handleView = (path: "detail" | "commits") => {
    if (repo.length === 0) {
      toast({
        title: "Invalid URL",
        description: "Please input a valid GitHub repository URL.",
      });
      return;
    }
    navigate(`/${path}`);
  };

  const logoUrl = new URL("../assets/logo.svg", import.meta.url).href;

  return (
    <div className="mt-12 flex flex-1 gap-4 items-center">
      <div className="w-1/2 flex justify-center items-center">
        <img className="w-3/5" src={logoUrl} alt="logo" />
      </div>
      <div className="flex-1 flex flex-col gap-8 ">
        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle>Detail Info</CardTitle>
            <CardDescription>GitHub repository details.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="ml-auto" onClick={() => handleView("detail")}>
              View Details<span className="i-carbon-arrow-right scale-75" />
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle>Commits History</CardTitle>
            <CardDescription>GitHub repository commit history.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="ml-auto" onClick={() => handleView("commits")}>
              View Commits<span className="i-carbon-arrow-right scale-75" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default SearchResult;
