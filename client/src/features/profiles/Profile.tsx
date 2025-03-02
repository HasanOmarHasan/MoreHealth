import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth.tsx"; 
import Avatar from '../../assets/img/avatar.svg'

interface MenuItem {
  label: string;
  path: string;
  subItems?: MenuItem[];
}

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const userType = user?.type || 'patient'; // Default to patient if no user

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuConfig: Record<string, MenuItem[]> = {
    doctor: [
      { label: "General", path: "/doctor/general" },
      {
        label: "Management",
        path: "#",
        subItems: [
          { label: "Team", path: "/doctor/team" },
          { label: "Patients", path: "/doctor/patients" },
          { label: "Schedule", path: "/doctor/schedule" },
        ],
      },
      { label: "العيادة", path: "/doctor/appointments" },
      { label: "احا", path: "/doctor/billing" },
    ],
    patient: [
      { label: "General", path: "/profile" },
      {
        label: "My Care",
        path: "#",
        subItems: [
          { label: "Doctors", path: "/profile#" },
          { label: "Bookings", path: "/profile#" },
          { label: "Medical History", path: "/profile#" },
        ],
      },
      { label: "Payments", path: "/profile" },
      { label: "Insurance", path: "/profile#" },
    ],
  };

  const renderMenuItems = (items: MenuItem[]) => (
    <ul className="mt-6 space-y-1">
      {items.map((item, index) => (
        <li key={index}>
          {item.subItems ? (
            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
                <span className="text-sm font-medium">{item.label}</span>
                <span className="shrink-0 transition duration-300 group-open:-rotate-180">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              </summary>
              <ul className="mt-2 space-y-1 px-4">
                {item.subItems.map((subItem, subIndex) => (
                  <li key={subIndex}>
                    <Link
                      to={subItem.path}
                      className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
                    >
                      {subItem.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </details>
          ) : (
            <Link
              to={item.path}
              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              {item.label}
            </Link>
          )}
        </li>
      ))}
      <li>
        <details className="group [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
            <span className="text-sm font-medium">Account</span>
            <span className="shrink-0 transition duration-300 group-open:-rotate-180">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
          </summary>
          <ul className="mt-2 space-y-1 px-4">
            <li>
              <Link
                to="#"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                Details
              </Link>
            </li>
            <li>
              <Link
                to="#"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                Security
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="w-full rounded-lg px-4 py-2 text-left text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
              >
                Logout
              </button>
            </li>
          </ul>
        </details>
      </li>
    </ul>
  );

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[200px_1fr] lg:gap-8">
      <div className="flex h-screen flex-col justify-between border-e bg-white">
        <div className="px-4 py-6">
          {renderMenuItems(menuConfig[userType])}
        </div>

        <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
          <div className="flex items-center gap-2 bg-white p-4 hover:bg-gray-50">
            <img
              alt="Profile"
              src={Avatar}
              className="size-10 rounded-full object-cover"
            />
            <div>
              <p className="text-xs">
                <strong className="block font-medium">
                  {user?.username || "Guest"}
                </strong>
                <span>{user?.email || "No email"}</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg">
        {/* Main content area */}
      </div>
    </div>
  );
}