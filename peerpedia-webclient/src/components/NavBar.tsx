import { Link } from "react-router-dom";

function NavBar() {
    const anchorStyle = "p-3 bg-white rounded-sm border border-gray-300 hover:scale-115 transition";
    const imgStyle = "size-[9vw] sm:size-[2vw]";

    return (
        <div className="fixed bottom-[1vh] sm:bottom-2 left-1/2 transform -translate-x-1/2 w-15/16 sm:w-fit rounded-sm bg-white flex justify-center items-center gap-2 opacity-90 hover:opacity-100 transition">
            <Link to="/" className={anchorStyle}>
                <img src="home.svg" alt="info" title="Home" height="1vw" width="1vw" className={imgStyle} />
            </Link>
            <Link to="/teach" className={anchorStyle}>
                <img src="teach.svg" alt="teach" title="Teach" height="1vw" width="1vw" className={imgStyle} />
            </Link>
            <Link to="/explore" className={anchorStyle}>
                <img src="explore.svg" alt="explore" title="Explore" height="1vw" width="1vw" className={imgStyle} />
            </Link>
            <Link to="/matchmaking" className={anchorStyle}>
                <img src="matchmaking.svg" alt="matchmaking" title="Matchmaking" height="1vw" width="1vw" className={imgStyle} />
            </Link>
            <Link to="/learn" className={anchorStyle}>
                <img src="learn.svg" alt="learn" title="Learn" height="1vw" width="1vw" className={imgStyle} />
            </Link>
            <Link to="/profile" className={anchorStyle}>
                <img src="profile.svg" alt="profile" title="Profile" height="1vw" width="1vw" className={imgStyle} />
            </Link>
        </div>
    )
}

export default NavBar;