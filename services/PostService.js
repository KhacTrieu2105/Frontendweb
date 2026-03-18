import httpAxios from "./httpaxios";

const PostService = {
  getList: (params) => {
    return httpAxios.get("/posts", { params });
  },

  getById: (id) => {
    return httpAxios.get(`/posts/${id}`);
  },

  // Fetch post by slug - first try to fetch all posts, then find by slug
  getBySlug: (slug) => {
    // Gọi trực tiếp vào route show của Laravel
    return httpAxios.get(`/posts/${slug}`);
},

  create: (data) => {
    return httpAxios.post("/posts", data);
  },

 update: (id, formData) => {
    // Lưu ý: Dùng .post thay vì .put khi gửi kèm file trong Laravel
    return httpAxios.post(`/post/${id}`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        }
    }).then(res => res.data);
},

  delete: (id) => {
    return httpAxios.delete(`/post/${id}`);
  },
};

export default PostService;
