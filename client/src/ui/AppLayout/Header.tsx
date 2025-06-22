import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import avater from "../../assets/img/avatar.svg";
import logo from "../../assets/img/logo.png";
import { useAuth } from "../../context/Auth";

export default function Header() {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isLoggedIn, logout } = useAuth();

  // const toggleServicesDropdown = () => setIsServicesOpen(!isServicesOpen);
  const toggleUserMenuDropdown = () => setIsUserMenuOpen(!isUserMenuOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Create refs for dropdown elements
  const servicesTriggerRef = useRef<HTMLButtonElement>(null);
  const servicesDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const userMenuDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  const renderDropdownContent = () => {
    if (!isLoggedIn) {
      return (
        <>
          <div className="p-2">
            <p className="block rounded-lg px-4 py-2 text-sm text-gray-500">
              Login First 
            </p>
          </div>
          <div className="p-2">
            <Link
              className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-blue-700 hover:bg-blue-50"
              to="/login"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                />
              </svg>
              Login
            </Link>
          </div>
        </>
      );
    }

    const commonLinks = [
      { to: "/profile/General", text: "General" },
      { to: "/profile/Account", text: "Account" },
    ];

    const roleSpecificLinks =
      user?.type === "patient"
        ? [
            { to: "/profile/chat-room", text: "My Chats with Doctor" },
            // { to: "/profile", text: "Bookings" },
          ]
        : [
            // { to: "/profile", text: "Management Team" },
            { to: "/profile/chat-room", text: "Management Patients" },
            // { to: "/profile", text: "Clinic" },
          ];

    return (
      <>
        <div className="p-2">
          {[...commonLinks, ...roleSpecificLinks].map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              role="menuitem"
              onClick={() => setIsUserMenuOpen(false)}
            >
              {link.text}
            </Link>
          ))}
        </div>
        <div className="p-2">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-4 py-2 text-sm text-red-700 hover:bg-red-50"
            role="menuitem"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
              />
            </svg>
            Logout
          </button>
        </div>
      </>
    );
  };

  // Handle click outside for services dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isServicesOpen &&
        servicesTriggerRef.current &&
        servicesDropdownRef.current &&
        !servicesTriggerRef.current.contains(event.target as Node) &&
        !servicesDropdownRef.current.contains(event.target as Node)
      ) {
        setIsServicesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isServicesOpen]);

  // Handle click outside for user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isUserMenuOpen &&
        userMenuTriggerRef.current &&
        userMenuDropdownRef.current &&
        !userMenuTriggerRef.current.contains(event.target as Node) &&
        !userMenuDropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isUserMenuOpen]);

  // Handle click outside for mobile menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuTriggerRef.current &&
        mobileMenuRef.current &&
        !mobileMenuTriggerRef.current.contains(event.target as Node) &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  return (
    //  bg-white/50
    <header className=" sticky top-0 z-50 backdrop-blur-sm bg-blue-100/50">
      <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="md:flex md:items-center md:gap-12">
            <Link
              className="block text-black text-xl font-semibold tracking-wider"
              to="/"
            >
              {/* <span>More Health</span> */}
              <img src={logo} alt="logo" className="h-40 w-40" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-6 text-base">
              {/* <li>
                <button
                  className={`cursor-pointer text-gray-500 transition hover:text-gray-500/75 inline-flex justify-center w-full items-center  `}
                  onClick={toggleServicesDropdown}
                  aria-expanded={isServicesOpen}
                  ref={servicesTriggerRef}
                >
                  More Services
                  <svg
                    className={`ml-1 -mr-1 h-5 w-5 transition-transform duration-200 ${
                      isServicesOpen ? " rotate-180" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isServicesOpen && (
                  <div
                    ref={servicesDropdownRef}
                    className="absolute mt-0.5 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"
                  >
                    <div className="p-2">
                      {[
                        "Book a consultation",
                        "Symptom analysis",
                        "Medical laboratories",
                        "All Services",
                      ].map((service, index) => (
                        <Link
                          key={index}
                          to="/services"
                          className="block rounded-lg px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                          role="menuitem"
                        >
                          {service}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li> */}

              {[
                { linkName: "Symptom Checker ", to: "/services/symptom-checker" },
                { linkName: "Groups", to: "/groups" },
                { linkName: "Ai Chat", to: "/services/ai-chat" },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    className="text-gray-500 transition hover:text-gray-500/75"
                    to={link.to}
                  >
                    {link.linkName}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Dropdown */}
          <div className="md:flex md:items-center md:gap-12">
            <div className="hidden md:relative md:block">
              <button
                ref={userMenuTriggerRef}
                type="button"
                className="overflow-hidden rounded-full border border-gray-300 shadow-inner"
                onClick={toggleUserMenuDropdown}
                aria-expanded={isUserMenuOpen}
              >
                <span className="sr-only">Toggle dashboard menu</span>
                <img
                  src={avater}
                  alt="user avatar"
                  className="size-10 object-cover"
                />
                {!isLoggedIn && (
                  <span className="absolute top-0 left-8 rounded-full size-4 bg-red-400 text-sm transform -translate-y-1 border-2 border-white" />
                )}
              </button>

              {isUserMenuOpen && (
                <div
                  ref={userMenuDropdownRef}
                  className="absolute end-0 z-10 mt-0.5 w-56 divide-y divide-gray-100 rounded-md border border-gray-100 bg-white shadow-lg"
                >
                  {renderDropdownContent()}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="block md:hidden">
              <button
                ref={mobileMenuTriggerRef}
                onClick={toggleMobileMenu}
                className={`rounded-sm bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75 ${
                  isMobileMenuOpen ? "active-mobile-menu-button" : ""
                }`}
                aria-expanded={isMobileMenuOpen}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}
      >
        <div className="bg-gray-100 p-4">
          {[
            { linkName: "Service", to: "/services/" },
            { linkName: "Groups", to: "/groups" },
            { linkName: "Ai Chat", to: "/services/ai-chat" },
            {
              linkName: isLoggedIn ? "Dashboard" : "Login",
              to: isLoggedIn ? "/profile" : "Login",
            },
          ].map((link, index) => (
            <Link
              key={index}
              to={link.to}
              className="block py-2 px-4 text-sm text-gray-500 hover:bg-gray-200"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.linkName}
            </Link>
          ))}
          <ul>

            <li>
              {isLoggedIn &&
              
              
              <button
                onClick={handleLogout}
                className="w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-red-400 hover:bg-red-100 hover:text-red-600"
              >
                Logout
              </button>
              }
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
