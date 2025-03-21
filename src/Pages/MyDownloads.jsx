import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc } from "firebase/firestore";
import PageTitle from "../Components/UI/PageTitle";
import { useUser } from "../Context/UserProvider";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

const MyDownloads = () => {
  const { currentUser, userProfile } = useUser();
  const [assets, setAssets] = useState([]);
  const [downloadedAssets, setDownloadedAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser && userProfile) {
      console.log("Current user:", currentUser);
      console.log("User profile:", userProfile);
      if (userProfile.downloadedItems && userProfile.downloadedItems.length > 0) {
        console.log("Setting downloaded assets:", userProfile.downloadedItems);
        setDownloadedAssets(userProfile.downloadedItems);
      } else {
        console.log("No downloaded assets found in user profile.");
      }
    }
  }, [currentUser, userProfile]);

  useEffect(() => {
    setLoading(true);
    const fetchAssets = async () => {
      try {
        console.log("Fetching assets for downloaded assets:", downloadedAssets);
        if (downloadedAssets.length > 0) {
          const assetPromises = downloadedAssets.map(async (assetId) => {
            const assetRef = doc(db, "Assets", assetId);
            const assetSnapshot = await getDoc(assetRef);
            if (assetSnapshot.exists()) {
              const assetData = assetSnapshot.data();
              return { id: assetId, ...assetData };
            } else {
              console.log(`No document found for asset ID: ${assetId}`);
              return null;
            }
          });

          const assetsData = await Promise.all(assetPromises);
          const filteredAssetsData = assetsData.filter(
            (asset) => asset !== null
          );
          console.log("Fetched assets data:", filteredAssetsData);
          setAssets(filteredAssetsData);
          setLoading(false);
        } else {
          console.log("No downloaded assets to fetch.");
          setLoading("no_items");
        }
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };

    fetchAssets();
  }, [downloadedAssets]);

  return (
    <>
      <Helmet>
        <title>
          My Downloads - {currentUser ? currentUser.displayName : "User"}
        </title>
      </Helmet>
      <div className="page_content">
        <PageTitle title="My Downloads" />
        <div className="item_listing">
          {loading === true ? (
            <div className="loading">Loading...</div>
          ) : loading === "no_items" ? (
            <div className="no_items">
              <span>No Downloads Found.</span>
            </div>
          ) : (
            assets.map((asset, index) => (
              <Link to={`/View/${asset.id}`} key={index}>
                <div className="item_card">
                  <div className="card_image">
                    {asset.discount > 0 ? (
                      <div className="discount_card">
                        <span>
                          <strong>-{asset.discount}%</strong>
                        </span>
                      </div>
                    ) : null}
                    <img src={asset.thumbnail} alt="placeholder" />
                  </div>

                  <div className="card_content">
                    <span className="title">
                      {asset.title}{" "}
                      <span className="publisher">
                        by Servant {asset.publisher}
                      </span>
                    </span>
                    <div className="details">
                      <span className="price">
                        <strong>
                          {asset.price -
                            (asset.price * asset.discount) / 100 ===
                          0
                            ? "Free"
                            : `$${(
                                asset.price -
                                (asset.price * asset.discount) / 100
                              ).toFixed(2)}`}
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default MyDownloads;