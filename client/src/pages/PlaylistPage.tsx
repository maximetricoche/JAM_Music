import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BannerPlaylist from "../components/BannerPlaylist";
import BannerSection from "../components/BannerSection";
import Loader from "../components/Loader";
import PlayButton from "../components/PlayButton";
import Wrapper from "../components/Wrapper";
import { searchPlaylist, searchPlaylistTracks } from "../services/deezerApi";
import type { Playlist, Track } from "../types/type";
import formatDuration from "../utils/formatDuration";

function PlaylistPage() {
  const { id } = useParams();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlist, setPlaylist] = useState<Playlist>();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const playlistData = await searchPlaylist(id);
        const tracksData = await searchPlaylistTracks(id);
        setPlaylist(playlistData);
        setTracks(tracksData);
      } catch (err) {
        console.error("Erreur lors du chargement des données :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <>
          <BannerSection showBg={false} showBorder={true}>
            <BannerPlaylist
              image={playlist?.picture_big}
              title={playlist?.title}
            />
          </BannerSection>
          <Wrapper variantWidth={false}>
            <div className="text-primary">
              <h2 className="m-6 font-title text-3xl laptop:text-6xl">
                {playlist?.title}
              </h2>
              <Wrapper variantWidth={true}>
                <ul className="w-full mx-auto flex flex-col items-center">
                  {tracks.map((track, index) => (
                    <li
                      key={track.id}
                      className="flex justify-between group items-center gap-y-8 gap-x-4 laptop:gap-20 border-secondary-250 border-b-2 w-full p-4 max-w-[800px] laptop:py-6 laptop:px-8 hover:bg-primary/5"
                    >
                      <div className="flex justify-center items-center gap-10">
                        <span className="hidden laptop:block text-lg w-6 text-center">
                          {index + 1}
                        </span>
                        <div className="bg-secondary-100 relative w-[60px] h-[60px] laptop:w-[100px] laptop:h-[100px] rounded-full flex items-center justify-center">
                          <img
                            src={
                              window.innerWidth >= 1024
                                ? track.album?.cover_big
                                : track.album?.cover_small
                            }
                            alt={track.title}
                            className="rounded-full border-2 border-accent w-14 h-14 laptop:w-24 laptop:h-24"
                          />
                          <div className="absolute bottom-0 right-0 hidden group-hover:flex">
                            <PlayButton
                              playlistTrackId={track.id}
                              playlistId={id}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="w-56 text-start laptop:text-center">
                        <p className="font-text">{track.artist?.name}</p>
                        <p className="text-sm">{track.title_short}</p>
                      </div>
                      <p>{formatDuration(track.duration)}</p>
                    </li>
                  ))}
                </ul>
              </Wrapper>
            </div>
          </Wrapper>
        </>
      )}
    </>
  );
}

export default PlaylistPage;
