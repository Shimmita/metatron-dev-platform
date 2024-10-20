// src/hooks/useScrollDirection.js
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { handleScrolledDown } from "../../redux/AppUI";

const useScrolledDown = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let lastScrollTop = 0;

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      if (scrollTop > lastScrollTop) {
        dispatch(handleScrolledDown(true));
      } else {
        dispatch(handleScrolledDown(false));
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [dispatch]);
};

export default useScrolledDown;
