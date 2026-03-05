import { useEffect, useRef, useState } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import Navbar from "./ComponentsPage/Navbar";
import { ExternalLink, Pause, Play, Search } from "lucide-react";

function App() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [inputError, setInputError] = useState(false);
  const [font, setFont] = useState("font-sans");
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // WORD FETCH FUNCTION
  const fetchWord = async (word) => {
    if (!word) return;

    try {
      setLoading(true);
      setError(false);
      setData(null);

      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      );

      if (!res.ok) throw new Error();

      const result = await res.json();
      setData(result[0]);

      localStorage.setItem("lastWord", word);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  // Form FUNCTION
  const MyWords = async () => {
    if (!search.trim()) {
      setInputError(true);
      return;
    }

    setInputError(false);
    fetchWord(search);
  };

  // Load last word
  useEffect(() => {
    const savedWord = localStorage.getItem("lastWord");
    if (savedWord) {
      setSearch(savedWord);
      fetchWord(savedWord);
    }
  }, []);

  // audio toggle
  const handleAudio = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const audioUrl = data?.phonetics?.find((p) => p.audio)?.audio;

  return (
    <ThemeProvider>
      <div className={font}>
        <Navbar setFont={setFont} />

        <div className="flex flex-col mx-auto mt-12 overflow-x-hidden w-[330px] sm:w-[560px] md:w-[740px]">
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
              onChange={(e) => {
                setSearch(e.target.value);
                if (e.target.value.trim()) setInputError(false);
              }}
              type="text"
              placeholder="Write your word..."
              className={`w-[325px] h-11 mt-1 mr-1 ml-1 rounded-xl bg-gray-100 dark:bg-[#1F1F1F] pl-4 pr-10 text-sm outline-none sm:w-[554px] md:w-[735px]
              ${
                inputError
                  ? "border border-red-500 focus:ring-1 focus:ring-red-500"
                  : "focus:ring-1 focus:ring-purple-500"
              }`}
            />

            <Search
              size={18}
              onClick={MyWords}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-500 cursor-pointer"
            />
          </form>

          {/* Validation */}
          {inputError && (
            <p className="text-red-500 text-sm mt-1 ml-2">
              Whoops, can’t be empty...
            </p>
          )}

          {/* loader */}
          {loading && (
            <div className="flex justify-center mt-12">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          {/* errror */}
          {error && !loading && (
            <div className="flex justify-center flex-col gap-5 items-center mt-20">
              <img src="./emoji.png" alt="" />
              <h4 className="font-bold">No Definitions Found</h4>
              <div className="flex items-center flex-col gap-0.5 text-[#757575] md:hidden">
                <p>Sorry  we couldn't find definitions</p>
                <p>You can search again. </p>

              </div>
              <div className=" hidden flex-col items-center  gap-0.5 text-[#757575] md:flex">
             
                <p>
                  Sorry pal, we couldn't find definitions for the word you were
                  looking for. 
                </p>
                <p className="flex items-center"> You can try the search again at later time or
                  head to the web instead.</p>
              </div>
            </div>
          )}

          {/* main */}
          {!loading && !error && data && (
            <div className="pt-12 pb-10">
              {/* WORD + AUDIO */}
              <div className="flex justify-between">
                <div className="font-bold text-[44px] dark:text-white">
                  {data.word}
                </div>

                {audioUrl && (
                  <div>
                    <div
                      onClick={handleAudio}
                      className="rounded-full bg-[#A445ED]/50 p-5 cursor-pointer"
                    >
                      {isPlaying ? (
                        <Pause size={24} className="text-[#A445ED]" />
                      ) : (
                        <Play size={24} className="text-[#A445ED]" />
                      )}
                    </div>
                    <audio
                      ref={audioRef}
                      src={audioUrl}
                      onEnded={() => setIsPlaying(false)}
                    />
                  </div>
                )}
              </div>

              <div className="text-purple-600 text-[18px]">
                {data.phonetics?.[0]?.text}
              </div>

              {/* meanings */}
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

                    {/* synonyms */}
                    {meaning.synonyms && meaning.synonyms.length > 0 && (
                      <div className="flex gap-4 pt-6 flex-wrap">
                        <span className="text-[#757575] text-[18px]">
                          Synonyms
                        </span>

                        {meaning.synonyms.map((el, index) => (
                          <span
                            key={index}
                            onClick={() => {
                              setSearch(el);
                              fetchWord(el);
                            }}
                            className="text-[#A445ED] font-semibold cursor-pointer"
                          >
                            {el}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* url */}
              {data.sourceUrls && (
                <div className="pt-10">
                  <div className="h-0.5 w-full bg-[#E9E9E9] dark:bg-[#3A3A3A]" />
                  <div className="flex items-center gap-4 pt-4">
                    <span className="text-[#757575]">Source</span>
                    <a
                      href={data.sourceUrls[0]}
                      target="_blank"
                      rel="noreferrer"
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
