import SearchResult from "@/components/SearchResult";
import SearchInput from "@/components/SearchInput";

function Search() {
  return (
    <div className="flex-1">
      <SearchInput />
      <SearchResult />
    </div>
  );
}

export default Search;
