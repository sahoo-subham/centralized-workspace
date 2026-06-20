import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { BellIcon } from "@heroicons/react/24/outline";

const navigation = [
  { name: "Dashboard", icon: "🏠" },
  { name: "Teams", icon: "👥" },
  { name: "Projects", icon: "📁" },
  { name: "Tasks", icon: "✅" },
  { name: "Documents", icon: "📄" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Navbar({ activePage, onNavigate, onLogout }) {
  return (
    <>
      <style>
        {`
        @keyframes pulse {
          0%,100% {
            transform:scale(1);
            opacity:1;
          }
          50% {
            transform:scale(1.4);
            opacity:.5;
          }
        }

        @keyframes logoGlow {
          0%,100% {
            box-shadow:0 0 20px rgba(99,102,241,.3);
          }
          50% {
            box-shadow:0 0 40px rgba(99,102,241,.8);
          }
        }
        `}
      </style>

      <nav className="w-full h-16 px-6 flex items-center justify-between bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 shadow-lg">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div
              style={{ animation: "logoGlow 3s infinite" }}
              className="h-11 w-11 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center"
            >
              ⚡
            </div>

            <span className="text-white font-bold text-lg hidden md:block">
              Workspace
            </span>
          </div>

          <div className="flex items-center gap-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => onNavigate(item.name)}
                className={classNames(
                  activePage === item.name
                    ? "bg-indigo-500/20 text-white shadow-inner"
                    : "text-gray-400 hover:text-white hover:bg-gray-800",
                  "group flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer border-none",
                )}
              >
                <span className="group-hover:scale-125 transition">
                  {item.icon}
                </span>

                {item.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-5">
          <button className="relative h-10 w-10 rounded-xl bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition cursor-pointer">
            <BellIcon className="h-5 w-5" />

            <span
              style={{ animation: "pulse 2s infinite" }}
              className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"
            />
          </button>

          <Menu as="div" className="relative">
            <MenuButton className="flex items-center gap-3 rounded-full border-none bg-transparent cursor-pointer focus:outline-none">
              <img
                src="user.png"
                alt="profile"
                className="h-10 w-10 rounded-full ring-2 ring-gray-700 hover:ring-indigo-500 transition"
              />
            </MenuButton>

            <MenuItems className="absolute right-0 mt-3 w-52 rounded-2xl bg-gray-900 border border-gray-700 shadow-2xl p-2 z-50 focus:outline-none">
              <MenuItem>
                {({ active }) => (
                  <button
                    className={classNames(
                      active ? "bg-gray-800 text-white" : "text-gray-300",
                      "w-full text-left px-4 py-3 rounded-xl text-sm transition border-none bg-transparent cursor-pointer",
                    )}
                  >
                    👤 Your Profile
                  </button>
                )}
              </MenuItem>

              <MenuItem>
                {({ active }) => (
                  <button
                    onClick={onLogout}
                    className={classNames(
                      active ? "bg-red-500/20 text-red-300" : "text-gray-300",
                      "w-full text-left px-4 py-3 rounded-xl text-sm transition border-none bg-transparent cursor-pointer",
                    )}
                  >
                    🚪 Sign out
                  </button>
                )}
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>
      </nav>
    </>
  );
}
