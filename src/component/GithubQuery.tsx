import React, { useEffect, useRef, useState } from "react";

import { usePostDataMutation } from "../api";

function GithubQuery() {
  const currPage: React.MutableRefObject<number> = useRef(1);
  const searchValue = useRef("");
  const [gitSearch, setGitSearch] = useState("");
  const [type, setType] = useState("users");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState([]);

  const [postData, { isLoading, isError, data: rtkData, error }] =
    usePostDataMutation();

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 5 &&
      !loading
    ) {
      const currentPage = currPage.current + 1;
      fetchData(currentPage);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [loading]);

  const fetchData = async (newPage: number) => {
    try {
      setLoading(true);
      const request = { type, search: searchValue.current, page: newPage };

      const data = await postData(request);

      if (data) {
        // @ts-ignore
        const newData = data && data.data.items;

        setResult((prevData: any) =>
          newData ? [...prevData, ...newData] : prevData
        );
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      currPage.current = newPage;
      setLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGitSearch(e.target.value);
    searchValue.current = e.target.value;
  };

  const handleTypeSwitch = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    setType(value);
    setGitSearch("");
    currPage.current = 1;
    searchValue.current = "";
    setResult([]);
  };

  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    fetchData(1);
  };

  return (
    <div>
      <div>
        <form
          onSubmit={submitHandler}
          className='flex justify-between items-center text-black w-full p-4 rounded-md'>
          <div className='flex-1 p-2 mr-2'>
            <label htmlFor='search' className='block mb-1 text-sm'>
              Search
            </label>
            <input
              className='w-full border border-black p-2 rounded-md'
              id='search'
              value={searchValue.current}
              onChange={(e) => handleSearch(e)}
              required
            />
          </div>

          <div className='flex-1 p-2 mr-2'>
            <label htmlFor='dropdown' className='block mb-1 text-sm'>
              Select an option:
            </label>
            <select
              className='w-full border border-black p-2 rounded-md'
              id='dropdown'
              value={type}
              onChange={(e) => handleTypeSwitch(e)}>
              <option key='users' value='users'>
                Users
              </option>
              <option key='repositories' value='repositories'>
                Repos
              </option>
            </select>
          </div>

          <div className='flex-1 p-2'>
            <label className='block mb-1 text-sm'>Submit</label>
            <button
              className='w-full h-10 bg-blue-500 text-white rounded-md'
              type='submit'>
              Submit
            </button>
          </div>
        </form>

        <div>
          {type === "repositories"
            ? result?.map((value: any) => {
                const { id, forks_url, name, languages_url, full_name } = value;

                // Fetching languages and forks causes rate limit

                // const languages = fetch(languages_url)
                //   .then((res) => res.json())
                //   .then((data) => console.log(data));

                // const forks = fetch(forks_url)
                //   .then((res) => res.json())
                //   .then((data) => console.log(data));

                return (
                  <div key={id} className='flex m-5 '>
                    <div className='flex-col border border-black bg-white p-3 w-full rounded-md'>
                      <div className='flex'>
                        <p className='text-black text-lg font-bold m-2'>
                          {full_name}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            : type === "users" &&
              result?.map((value: any) => {
                const { id, avatar_url, login, html_url } = value;

                return (
                  <div key={id} className='flex m-5 '>
                    <div className='flex-col border border-black bg-white p-3 w-full rounded-md'>
                      <div className='flex'>
                        <img
                          src={avatar_url}
                          alt={login}
                          className='w-10 h-auto rounded-full m-2'
                        />
                        <p className='text-black text-lg font-bold m-2'>
                          {login}
                        </p>
                      </div>

                      <div>
                        <a rel='noreferrer' target='_blank' href={html_url}>
                          {html_url}
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
      {loading && <p>Loading...</p>}
    </div>
  );
}

export default GithubQuery;
