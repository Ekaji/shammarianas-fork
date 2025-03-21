import { useState, useEffect, useCallback } from "react";
import { getDocs, collection, query } from "firebase/firestore";
import { db } from "../../../firebase";
import ListedItemCard from "../UI/ListedItemCard";
import PageTitle from "../UI/PageTitle";
import ItemsListing from "../ItemsListing";


// const Navbar = () => {
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

//   const toggleMobileMenu = () => {
//     setIsMobileMenuOpen(!isMobileMenuOpen);
//   };

//   return (
//     <div style={{position: 'absolute'}} className="stock-container container ">
//       <nav className="stock-navbar stock-page_content">
//         <ul className={stock-navbar-nav ${isMobileMenuOpen ? "active" : ""}}>
//           <li>
//             <a href="/#images">Images</a>
//           </li>
//           <li>
//             <a href="/#icons">Icons</a>
//           </li>
//           <li>
//             <a href="/#videos">Videos</a>
//           </li>
//           <li>
//             <a href="/#template">Template</a>
//           </li>
//           <li>
//             <a href="/#psd">PSD</a>
//           </li>
//           <li>
//             <a href="/#mockup">Mockup</a>
//           </li>
//           <li>
//             <a href="/#more">More</a>
//           </li>
//         </ul>
//         <div className="stock-navbar-toggle" onClick={toggleMobileMenu}>
//           MENU<span className="stock-arrow_head">🢓</span> 
//         </div>
//       </nav>
//     </div>
//   );
// };


const HeroSection = () => {
  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [displayResults, setDisplayResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [overlay, setOverlay] = useState(false);

  // Assets State
  const [assets, setAssets] = useState([]);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [error, setError] = useState(null);

  // Debounce Function
  const debounce = (func, delay) => {
    let debounceTimer;
    return function (...args) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  // Fetch Search Results
  const fetchSearchResults = useCallback(async () => {
    if (searchTerm.trim() === "") return;
    setLoading(true);
    const q = query(collection(db, "Assets"));
    const querySnapshot = await getDocs(q);
    const allResults = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const newResults = allResults
      .filter((result) => result.title.toLowerCase().includes(searchTerm.toLowerCase()))
      .slice(0, 7);
    setSearchResults(newResults);
    setLoading(false);
    setDisplayResults(searchTerm !== "");
  }, [searchTerm]);

  // Fetch All Assets
  const fetchAssets = useCallback(async () => {
    try {
      const q = query(collection(db, "Assets"));
      const querySnapshot = await getDocs(q);
      const assetsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setAssets(assetsData);
      setFilteredAssets(assetsData); // Initialize filtered assets
    } catch (error) {
      setError(error.message);
    }
  }, []);

  // Handle Search Input Change
  const handleSearchChange = debounce((e) => {
    setSearchTerm(e.target.value);
  }, 1000);

  // Handle Search Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchSearchResults();
  };

  // Filter Assets by Category
  // const filterAssetsByCategory = (category) => {
  //   return assets.filter((asset) => asset.type === category);
  // };

  // Effects
  useEffect(() => {
    if (searchTerm !== "") {
      fetchSearchResults();
    } else {
      setSearchResults([]);
      setDisplayResults(false);
    }
  }, [searchTerm, fetchSearchResults]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  useEffect(() => {
    console.log({searchResults});
  }, [searchResults]);

  const sortedResults = searchResults.sort((a, b) => a.type.localeCompare(b.type));

  const groupedResults = sortedResults.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {});

  return (
    <>
      {/* Overlay */}
      {overlay && (
        <div
          className="search_overlay"
          onClick={() => {
            const overlay = document.querySelector(".search_overlay");
            overlay.classList.add("fade");
            setTimeout(() => setOverlay(false), 190);
          }}
        ></div>
      )}

      {/* Hero Section */}
      <>
      </>
      <div className="hero-container">
        {/* <Navbar /> */}
        <div className="hero-background">
        </div>
        <div className="hero-content">
          <h1 className="hero-title">Smarter creativity, faster designs</h1>
          <p className="hero-subtitle">
            Everything you need, from stock images and videos to AI-powered design tools.
          </p>

          {/* Search Component */}
          <div className="search-container">
            <div className="search-wrapper">
              <form onSubmit={handleSubmit} className="search-form">
                <div className="search-input-container">
                  <input
                    type="text"
                    placeholder="Search all assets"
                    className="search-input search-hero-input"
                    onChange={handleSearchChange}
                    onClick={() => {
                      setDisplayResults(false);
                      overlay ? "" : setOverlay(true);
                    }}
                  />
                </div>
                <button type="submit" className="search-button">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results */}
      {displayResults && (
          <section className="services-inline2 section-padding sub-bg bord-bottom-grd bord-top-grd">
          <div className="container ontop">
            <div className="sec-head mb-80">
              <div className="d-flex align-items-center">
                <div>
                  <span className="sub-title main-color mb-5">Our Stocks</span>
                  <h3 className="fw-600 fz-50 text-u d-rotate wow">
                    <span className="rotate-text">
                    Search <span className="fw-200"> Results.</span>
                    </span>
                  </h3>
                </div>
                <div className="ml-auto vi-more">
                  <a href="#Hot" className="butn butn-sm butn-bord radius-30">
                    <span>View All</span>
                  </a>
                  <span className="icon ti-arrow-top-right"></span>
                </div>
              </div>
            </div>

            {/* Hot Assets */}
            {/* <div className="page_content">
              <PageTitle title="Search" />
                <div className="listing_section">
                  <div className="item_listing">
                  {searchResults.length === 0 ? <div className="loading">Loading...</div> : null}
                    {searchResults.map((item) => (
                      <ListedItemCard key={item.id} id={item.id} data={item} />
                    ))}
                  </div>
                </div>
              </div> */}
                  <div className="page_content">
      {Object.keys(groupedResults).map((type) => (
        
          <>
          <PageTitle title={type} />
          <div className="listing_section">
            <div className="item_listing">
              {groupedResults[type].map((item) => (
                <ListedItemCard key={item.id} id={item.id} data={item} />
              ))}
            </div>
          </div>
          </>
       
      ))}
    </div>
            </div>
          </section>
        )}

      {/* Product List Section */}
      {
      !displayResults && (
      <section className="services-inline2 section-padding sub-bg bord-bottom-grd bord-top-grd">
        <div className="container ontop">
          <div className="sec-head mb-80">
            <div className="d-flex align-items-center">
              <div>
                <span className="sub-title main-color mb-5">Our Stocks</span>
                <h3 className="fw-600 fz-50 text-u d-rotate wow">
                  <span className="rotate-text">
                    Trending <span className="fw-200">Stock.</span>
                  </span>
                </h3>
              </div>
              <div className="ml-auto vi-more">
                <a href="#Hot" className="butn butn-sm butn-bord radius-30">
                  <span>View All</span>
                </a>
                <span className="icon ti-arrow-top-right"></span>
              </div>
            </div>
          </div>

          {/* Hot Assets */}
          <div className="page_content">
            <div style={{display: 'flex', width: "100%", justifyContent: 'space-between'}}>
            <PageTitle title="Videos" />
            <span style={{width: '100px', display: 'flex', flexWrap: 'nowrap', alignSelf: 'center'}}>{'See All'}</span>
            </div>
            <ItemsListing limit={4} />
          </div>

          {/* Models */}
          <div className="page_content">
            <div style={{display: 'flex', width: "100%", justifyContent: 'space-between'}}>
            <PageTitle title="Video Templates" />
            <span style={{width: '100px', display: 'flex', flexWrap: 'nowrap', alignSelf: 'center'}}>{'See All'}</span>
            </div>
            <ItemsListing limit={4} category={'models'} />
          </div>

          {/* Images */}
          <div className="page_content">
            <div style={{display: 'flex', width: "100%", justifyContent: 'space-between'}}>
            <PageTitle title="Pictures" />
            <span style={{width: '100px', display: 'flex', flexWrap: 'nowrap', alignSelf: 'center'}}>{'See All'}</span>
            </div>
            <ItemsListing limit={4} category={'images'} />
          </div>
          {/*  */}
          <div className="page_content">
            <div style={{display: 'flex', width: "100%", justifyContent: 'space-between'}}>
            <PageTitle title="Graphics Templates" />
            <span style={{width: '100px', display: 'flex', flexWrap: 'nowrap', alignSelf: 'center'}}>{'See All'}</span>
            </div>
            <ItemsListing limit={4} category={'images'} />
          </div>
          <div className="page_content">
            <div style={{display: 'flex', width: "100%", justifyContent: 'space-between'}}>
            <PageTitle title="Mockup" />
            <span style={{width: '100px', display: 'flex', flexWrap: 'nowrap', alignSelf: 'center'}}>{'See All'}</span>
            </div>
            <ItemsListing limit={4} category={'images'} />
          </div>
          <div className="page_content">
            <div style={{display: 'flex', width: "100%", justifyContent: 'space-between'}}>
            <PageTitle title="3D Models" />
            <span style={{width: '100px', display: 'flex', flexWrap: 'nowrap', alignSelf: 'center'}}>{'See All'}</span>
            </div>
            <ItemsListing limit={4} category={'images'} />
          </div>
          <div className="page_content">
            <div style={{display: 'flex', width: "100%", justifyContent: 'space-between'}}>
            <PageTitle title="Fonts" />
            <span style={{width: '100px', display: 'flex', flexWrap: 'nowrap', alignSelf: 'center'}}>{'See All'}</span>
            </div>
            <ItemsListing limit={4} category={'images'} />
          </div>
          <div className="page_content">
            <div style={{display: 'flex', width: "100%", justifyContent: 'space-between'}}>
            <PageTitle title="Icons" />
            <span style={{width: '100px', display: 'flex', flexWrap: 'nowrap', alignSelf: 'center'}}>{'See All'}</span>
            </div>
            <ItemsListing limit={4} category={'images'} />
          </div>
        </div>
      </section>
        )
      }
    </>
  );
};

export default HeroSection;