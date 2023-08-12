import { useLocation } from "react-router-dom";
import ViewDetail from "../../components/Book/ViewDetail";

const BookPage = () => {
  let location = useLocation();
  let params = new URLSearchParams(location.search)
  const bookID = params.get("id")
  console.log(">>parm id", params.get("id"))
  return (
    <>
      <ViewDetail
        bookID={bookID}
      />
    </>
  )
}

export default BookPage