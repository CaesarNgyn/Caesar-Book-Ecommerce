
import PacmanLoader from "react-spinners/PacmanLoader";

const Loading = () => {
  const style = { position: "fixed", top: "50%", left: "50%", transform: "translate(-120%, -50%)" };


  return (
    <>
      <div style={style}>
        <PacmanLoader
          color="#36d7b7"
          size="100px"

        />

      </div>
    </>
  )
}

export default Loading

