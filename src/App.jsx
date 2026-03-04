import { useEffect, useRef, useState } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import Navbar from "./ComponentsPage/Navbar";
import { ExternalLink, Play, Search } from "lucide-react";

function App() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
   const [font, setFont] = useState("font-sans");

  const audioRef = useRef(null);

  const MyWords = async () => {
  if (!search.trim()) return;

  try {
    setLoading(true);
    setError(false);
    setData(null);

    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${search}`
    );

    if (!res.ok) throw new Error();

    const result = await res.json();
    setData(result[0]);

   
    localStorage.setItem("lastWord", search);

  } catch {
    setError(true);
  } finally {
    setLoading(false);
  }
};

// take last word that was search
useEffect(() => {
  const savedWord = localStorage.getItem("lastWord");
  if (savedWord) {
    setSearch(savedWord);
 
    fetchWord(savedWord);
  }
}, []);


const fetchWord = async (word) => {
  if (!word) return;
  try {
    setLoading(true);
    setError(false);
    setData(null);

    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    if (!res.ok) throw new Error();

    const result = await res.json();
    setData(result[0]);
  } catch {
    setError(true);
  } finally {
    setLoading(false);
  }
};

  const audioUrl = data?.phonetics?.find(p => p.audio)?.audio;

  return (
    <ThemeProvider>
      <div className={font} >
        <Navbar setFont={setFont}/>

        <div className="flex flex-col mx-auto mt-12 overflow-hidden w-[330px] sm:w-[560px] md:w-[740px]">

       

          {/* FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              MyWords();
            }}
            className="relative"
          >
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              placeholder="Write your word..."
              className="w-full h-11 rounded-xl bg-gray-100 dark:bg-[#1F1F1F] pl-4 pr-10 text-sm outline-none focus:ring-2 focus:ring-purple-500"
            />

            <Search
              size={18}
              onClick={MyWords}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 cursor-pointer"
            />
          </form>

          {/* LOADER */}
          {loading && (
            <div className="flex justify-center mt-12">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* ERROR */}
          {error && !loading && (
            <div className="flex justify-center flex-col gap-5 items-center mt-20">
         <img src="./emoji.png" alt="" />
         <h4 className="font-bold">No Definitions Found</h4>
         <div className="flex flex-col items-center gap-0.5 text-[#757575]">
           <p>Sorry pal, we couldn't find definitions for the word you were looking for. You can try  </p> <span>the search again at later time or head to the web instead.</span>
          
         </div>
          </div>
          )}

          {/* CONTENT */}
          {!loading && !error && data && (
            <div className="pt-12 pb-10 ">
          {/* audio word */}
              <div className="flex justify-between">
                <div className="font-bold text-[44px] dark:text-white">
                  {data.word}
                </div>

                {audioUrl && (
                  <div
                    onClick={() => audioRef.current?.play()}
                    className="rounded-full bg-[#A445ED]/50 p-5 cursor-pointer"
                  >
                    <Play size={24} className="text-[#A445ED]" />
                    <audio ref={audioRef} src={audioUrl} />
                  </div>
                )}
              </div>

              <div className="text-purple-600 text-[18px]">
                {data.phonetics?.[0]?.text}
              </div>
              {/* meanings synonyms */}
<div className="pt-6">
  {data.meanings?.map((meaning, i) => (
    <div key={i} className="pt-6">

      <div className="flex gap-4 items-center">
        <i className="font-bold dark:text-white">
          {meaning.partOfSpeech}
        </i>
        <div className="h-0.5 w-full bg-[#E9E9E9] dark:bg-[#3A3A3A]" />
      </div>

      <div className="pt-[18px]">
        <span className="text-[#757575] text-[18px]">
          Meaning
        </span>
      </div>

      {meaning.definitions?.map((d, ind) => (
        <div key={ind} className="pl-5">
          <div className="flex gap-4 mt-4">
          <div>
              <div className="w-3 h-3 rounded-full bg-[#8F19E8] mt-2" />
          </div>
         <div>
             <span className="dark:text-white">
              {d.definition}
            </span>
         </div>
          </div>
        </div>
      ))}

      {/*  synonyms */}
      {meaning.synonyms && meaning.synonyms.length > 0 && (
        <div className="flex gap-4 pt-6 pl-0">
          <span className="text-[#757575] text-[18px]">
            Synonyms
          </span>
          <span className="text-[#A445ED] font-semibold">
            {meaning.synonyms.join(", ")}
          </span>
        </div>
      )}

    </div>
  ))}
</div>

              {data.sourceUrls && (
                <div className="pt-10">
                  <div className="h-0.5 w-full bg-[#E9E9E9] dark:bg-[#3A3A3A]" />
                  <div className="flex items-center gap-4 pt-4">
                    <span className="text-[#757575]">Source</span>
                    <a
                      href={data.sourceUrls[0]}
                      target="_blank"
                      className="flex items-center gap-2 hover:text-blue-600"
                    >
                      {data.sourceUrls[0]}
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;