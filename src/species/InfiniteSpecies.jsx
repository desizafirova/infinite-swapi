import InfiniteScroll from 'react-infinite-scroller';
import { Species } from './Species';
import { useInfiniteQuery } from '@tanstack/react-query';

const initialUrl = 'https://swapi.py4e.com/api/species/';
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfiniteSpecies() {
  const {
    data,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isError,
    error,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ['sw-species'],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => lastPage.next || undefined,
  });

  if (isLoading) return <div className="loading">Loading...</div>;
  if (isError) return <div className="error">Error: {error.toString()}</div>;

  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}{' '}
      <InfiniteScroll
        initialLoad={false}
        hasMore={hasNextPage}
        loadMore={() => {
          if (!isFetching) fetchNextPage;
        }}
      >
        {data.pages.map((pageData) =>
          pageData.results.map((species) => (
            <Species
              key={species.name}
              name={species.name}
              language={species.language}
              averageLifespan={species.average_lifespan}
            />
          ))
        )}
      </InfiniteScroll>
    </>
  );
}
