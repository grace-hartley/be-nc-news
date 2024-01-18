const db = require("../db/connection");

exports.findCommentToDelete = ({ comment_id }) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *`, [
      comment_id,
    ])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ msg: "Comment Not Found" });
      }
    });
};
