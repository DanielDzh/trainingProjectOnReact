import React, { useEffect, useState } from 'react';
import PostFilter from "../components/PostFilter";
import PostForm from '../components/PostForm';
import PostLists from '../components/PostLists';
import MyButton from '../components/UI/button/MyButton';
import MyModal from '../components/UI/MyModal/MyModal';
import { usePosts } from '../hooks/usePosts';
import PostService from '../API/PostService';
import Loader from '../components/UI/Loader/Loader';
import { useFetching } from '../hooks/useFetching';
import { getPageCount } from '../utils/pages';
import Pagination from '../components/UI/pagination/Pagination';

function Posts() {
   const [posts, setPosts] = useState([]);
   const [filter, setFilter] = useState({ sort: '', query: '' });
   const [modal, setModal] = useState(false);
   const [totalPages, setTotalPages] = useState(0);
   const [limit, setLimit] = useState(10);
   const [page, setPage] = useState(1);

   const [fetchPosts, isPostsLoading, postError] = useFetching(async () => {
      const response = await PostService.getAll(limit, page);
      setPosts(response.data);
      const totalCount = (response.headers['x-total-count']);
      setTotalPages(getPageCount(totalCount, limit));
   })

   const sortedAndSerchedPosts = usePosts(posts, filter.sort, filter.query);



   useEffect(() => {
      fetchPosts();
   }, [page]);

   // const [post, setPost] = useState({ title: '', body: '' }); // меняет состояние елемента

   // const bodyInputRef = useRef(); // даёт возможность получить елемент DOM-дерева

   const createPost = (newPost) => {
      setPosts([...posts, newPost]);
      setModal(false);
   }
   const removePost = (post) => {
      setPosts(posts.filter(e => e.id !== post.id));
   }

   const changePage = (page) => {
      setPage(page);
   }

   return (
      <div className="App">
         {/* <MyButton onClick={fetchPosts}>Get Posts</MyButton> */}
         <MyButton style={{ marginTop: '30px' }} onClick={() => setModal(true)}>
            Создать пользователя
         </MyButton>
         <MyModal visible={modal} setVisible={setModal}>
            <PostForm create={createPost} />
         </MyModal>
         <hr style={{ margin: '15px 0' }} />
         <PostFilter filter={filter} setFilter={setFilter} />
         {postError
            ? <h1>Произошла ошибка {postError}</h1>
            : isPostsLoading
               ? <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}><Loader /></div>
               : <PostLists remove={removePost} posts={sortedAndSerchedPosts} title="Список постов" />

         }
         <Pagination
            page={page}
            changePage={changePage}
            totalPages={totalPages}
         />

      </div >
   );
}

export default Posts;
