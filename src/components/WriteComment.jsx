import { Send } from "react-bootstrap-icons";

const WriteComment = ({ formik, handleCancel }) => {
  return (
    <div className="flex-1 flex !flex-nowrap sm:!flex-wrap gap-1">
      <div className="w-full">
        <textarea
          name="content"
          id="content"
          rows={1}
          {...formik.getFieldProps("content")}
          placeholder="Write a comment..."
          className="form-control form-field"
        ></textarea>
      </div>
      <div className="flex justify-between gap-2 sm:w-full">
        <button
          type="button"
          className="text-red-300 hover:text-red-500 "
          onClick={handleCancel}
        >
          Close
        </button>
        <button
          type="button"
          className="form-btn"
          disabled={formik.isSubmitting}
          onClick={formik.handleSubmit}
        >
          <Send className="text-lg" />
        </button>
      </div>
    </div>
  );
};
export default WriteComment;
