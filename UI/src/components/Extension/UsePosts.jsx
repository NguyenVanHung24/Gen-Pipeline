import { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

export const usePosts = (searchParams) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(null);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const { getToken } = useAuth();
  const API_BASE_URL = process.env.REACT_APP_BACK_END_URL;

  const fetchPosts = async (pageParam = 1) => {
    try {
      const token = await getToken();
      const params = new URLSearchParams(searchParams);
      params.append('page', pageParam);

      const response = await fetch(
        `${API_BASE_URL}/posts?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return { 
        posts: data.posts, 
        hasMore: data.hasMore 
      };
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  };

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      setIsError(null);

      try {
        const result = await fetchPosts(1);
        setPosts(result.posts);
        setHasNextPage(result.hasMore);
        setPage(2);
      } catch (error) {
        setIsError(error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [searchParams]);

  const fetchNextPage = async () => {
    if (!hasNextPage || isFetchingNextPage) return;

    setIsFetchingNextPage(true);
    try {
      const result = await fetchPosts(page);
      setPosts((prevPosts) => [...prevPosts, ...result.posts]);
      setHasNextPage(result.hasMore);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      setIsError(error);
    } finally {
      setIsFetchingNextPage(false);
    }
  };

  return {
    allPosts: posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError
  };
};
