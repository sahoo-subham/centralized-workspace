import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { BellIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

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
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (page) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  return (
    <>
      <style>
        {`
        @keyframes pulse {
          0%,100%{
            transform:scale(1);
            opacity:1;
          }
          50%{
            transform:scale(1.4);
            opacity:.5;
          }
        }

        @keyframes logoGlow {
          0%,100%{
            box-shadow:0 0 20px rgba(99,102,241,.3);
          }
          50%{
            box-shadow:0 0 40px rgba(99,102,241,.8);
          }
        }
        `}
      </style>

      <nav
        className="
        w-full h-16
        px-4 md:px-6
        flex items-center justify-between
        bg-gray-900/80
        backdrop-blur-xl
        border-b border-gray-700/50
        shadow-lg
        relative z-50
        "
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div
              style={{
                animation: "logoGlow 3s infinite",
              }}
              className="
              h-10 w-10
              md:h-11 md:w-11
              rounded-xl
              bg-indigo-500/20
              border border-indigo-400/30
              flex items-center justify-center
              "
            >
              ⚡
            </div>
            <span
              className="
              text-white
              font-bold
              text-lg
              hidden sm:block
              "
            >
              Workspace
            </span>
          </div>
          <div
            className="
            hidden
            min-[880px]:flex
            items-center
            gap-1
            "
          >
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigate(item.name)}
                className={classNames(
                  activePage === item.name
                    ? "bg-indigo-500/20 text-white shadow-inner"
                    : "text-gray-400 hover:text-white hover:bg-gray-800",
                  `
                  group
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2
                  rounded-xl
                  text-sm
                  font-medium
                  transition-all
                  duration-300
                  cursor-pointer
                  `,
                )}
              >
                <span
                  className="
                  group-hover:scale-125
                  transition
                  "
                >
                  {item.icon}
                </span>
                {item.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="
            min-[880px]:hidden
            h-10
            w-10
            rounded-xl
            bg-gray-800
            border border-gray-700
            text-gray-300
            flex
            items-center
            justify-center
            "
          >
            {mobileOpen ? (
              <XMarkIcon className="h-5 w-5" />
            ) : (
              <Bars3Icon className="h-5 w-5" />
            )}
          </button>
        </div>

        <div
          className="
          flex
          items-center
          gap-3
          md:gap-5
          "
        >
          <button
            className="
            relative
            h-10
            w-10
            rounded-xl
            bg-gray-800
            border border-gray-700
            flex
            items-center
            justify-center
            text-gray-400
            hover:text-white
            hover:bg-gray-700
            transition
            "
          >
            <BellIcon className="h-5 w-5" />
            <span
              style={{
                animation: "pulse 2s infinite",
              }}
              className="
              absolute
              top-2
              right-2
              h-2
              w-2
              rounded-full
              bg-red-500
              "
            />
          </button>

          <Menu as="div" className="relative">
            <MenuButton
              className="
              flex
              items-center
              rounded-full
              bg-transparent
              cursor-pointer
              "
            >
              <img
                src="user.png"
                alt="profile"
                className="
                h-9
                w-9
                md:h-10
                md:w-10
                rounded-full
                ring-2
                ring-gray-700
                hover:ring-indigo-500
                transition
                "
              />
            </MenuButton>
            <MenuItems
              className="
              absolute
              right-0
              mt-3
              w-52
              rounded-2xl
              bg-gray-900
              border border-gray-700
              shadow-2xl
              p-2
              z-50
              "
            >
              <MenuItem>
                {({ active }) => (
                  <button
                    className={classNames(
                      active ? "bg-gray-800 text-white" : "text-gray-300",
                      `
                      w-full
                      text-left
                      px-4
                      py-3
                      rounded-xl
                      text-sm
                      transition
                      `,
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
                      `
                      w-full
                      text-left
                      px-4
                      py-3
                      rounded-xl
                      text-sm
                      transition
                      `,
                    )}
                  >
                    🚪 Sign out
                  </button>
                )}
              </MenuItem>
            </MenuItems>
          </Menu>
        </div>

        {mobileOpen && (
          <div
            className="
            absolute
            top-16
            left-0
            w-full
            bg-gray-900
            border-b
            border-gray-700
            p-4
            min-[880px]:hidden
            shadow-xl
            "
          >
            <div
              className="
              flex
              flex-col
              gap-2
              "
            >
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigate(item.name)}
                  className={classNames(
                    activePage === item.name
                      ? "bg-indigo-500/20 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800",
                    `
                    flex
                    items-center
                    gap-3
                    px-4
                    py-3
                    rounded-xl
                    text-sm
                    transition
                    `,
                  )}
                >
                  <span>{item.icon}</span>
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}













// import { Menu, MenuButton, MenuItem, MenuItems, Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
// import {
//   BellIcon,
//   HomeIcon,
//   UsersIcon,
//   FolderIcon,
//   CheckCircleIcon,
//   DocumentTextIcon,
//   MagnifyingGlassIcon,
//   Bars3Icon,
//   XMarkIcon,
//   ChevronDownIcon,
//   UserCircleIcon,
//   Cog6ToothIcon,
//   ArrowRightOnRectangleIcon,
// } from "@heroicons/react/24/outline";

// const navigation = [
//   { name: "Dashboard", Icon: HomeIcon },
//   { name: "Teams", Icon: UsersIcon },
//   { name: "Projects", Icon: FolderIcon },
//   { name: "Tasks", Icon: CheckCircleIcon },
//   { name: "Documents", Icon: DocumentTextIcon },
// ];

// function cx(...classes) {
//   return classes.filter(Boolean).join(" ");
// }

// export default function Navbar({ activePage, onNavigate, onLogout }) {
//   return (
//     <Disclosure
//       as="header"
//       className="sticky top-0 z-50 w-full border-b border-slate-200/70 bg-white/75 backdrop-blur-xl"
//     >
//       {({ open, close }) => (
//         <>
//           <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//             <div className="flex h-16 items-center justify-between gap-4">
//               <div className="flex items-center gap-3">
//                 <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30">
//                   <span className="text-sm font-bold tracking-tight">W</span>
//                   <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
//                 </div>
//                 <div className="leading-tight">
//                   <p className="text-sm font-semibold text-slate-900">Workspace</p>
//                   <p className="text-[11px] font-medium text-slate-500">Acme Inc.</p>
//                 </div>
//               </div>

//               <nav className="hidden items-center gap-1 lg:flex">
//                 {navigation.map(({ name, Icon }) => {
//                   const active = activePage === name;
//                   return (
//                     <button
//                       key={name}
//                       type="button"
//                       onClick={() => onNavigate(name)}
//                       aria-current={active ? "page" : undefined}
//                       className={cx(
//                         "group relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all",
//                         active
//                           ? "text-indigo-600"
//                           : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
//                       )}
//                     >
//                       <Icon className={cx("h-4 w-4 transition-colors", active ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600")} />
//                       {name}
//                       {active && (
//                         <span className="absolute inset-x-3 -bottom-[17px] h-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500" />
//                       )}
//                     </button>
//                   );
//                 })}
//               </nav>

//               <div className="flex items-center gap-2">

//                 <button
//                   type="button"
//                   aria-label="View notifications"
//                   className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
//                 >
//                   <BellIcon className="h-5 w-5" />
//                   <span className="absolute right-2 top-2 flex h-2 w-2">
//                     <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
//                     <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white" />
//                   </span>
//                 </button>

//                 <Menu as="div" className="relative">
//                   <MenuButton className="group flex items-center gap-2 rounded-lg p-1 pr-2 transition hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500">
//                     <span className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-slate-700 to-slate-900 text-xs font-semibold text-white shadow-sm ring-2 ring-white">
//                       YP
//                     </span>
//                     <ChevronDownIcon className="hidden h-4 w-4 text-slate-400 transition group-data-open:rotate-180 sm:block" />
//                   </MenuButton>
//                   <MenuItems
//                     transition
//                     anchor="bottom end"
//                     className="z-50 mt-2 w-60 origin-top-right rounded-xl border border-slate-200 bg-white p-1.5 text-slate-700 shadow-xl shadow-slate-900/10 transition duration-100 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 focus:outline-none"
//                   >
//                     <div className="flex items-center gap-3 rounded-lg px-3 py-2.5">
//                       <span className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-slate-700 to-slate-900 text-xs font-semibold text-white">
//                         YP
//                       </span>
//                       <div className="min-w-0 leading-tight">
//                         <p className="truncate text-sm font-semibold text-slate-900">Your Profile</p>
//                         <p className="truncate text-xs text-slate-500">you@workspace.com</p>
//                       </div>
//                     </div>
//                     <div className="my-1 h-px bg-slate-100" />
//                     <MenuItem>
//                       {({ focus }) => (
//                         <button
//                           type="button"
//                           className={cx(
//                             "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm",
//                             focus ? "bg-slate-100 text-slate-900" : "text-slate-700",
//                           )}
//                         >
//                           <UserCircleIcon className="h-4 w-4 text-slate-400" />
//                           Account
//                         </button>
//                       )}
//                     </MenuItem>
//                     <div className="my-1 h-px bg-slate-100" />
//                     <MenuItem>
//                       {({ focus }) => (
//                         <button
//                           type="button"
//                           onClick={onLogout}
//                           className={cx(
//                             "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm",
//                             focus ? "bg-red-50 text-red-700" : "text-red-600",
//                           )}
//                         >
//                           <ArrowRightOnRectangleIcon className="h-4 w-4" />
//                           Sign out
//                         </button>
//                       )}
//                     </MenuItem>
//                   </MenuItems>
//                 </Menu>

//                 <DisclosureButton className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 lg:hidden">
//                   {open ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
//                 </DisclosureButton>
//               </div>
//             </div>
//           </div>

//           <DisclosurePanel className="border-t border-slate-200/70 bg-white lg:hidden">
//             <nav className="space-y-1 px-3 py-3">
//               {navigation.map(({ name, Icon }) => {
//                 const active = activePage === name;
//                 return (
//                   <button
//                     key={name}
//                     type="button"
//                     onClick={() => {
//                       onNavigate(name);
//                       close();
//                     }}
//                     className={cx(
//                       "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
//                       active
//                         ? "bg-indigo-50 text-indigo-700"
//                         : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
//                     )}
//                   >
//                     <Icon className={cx("h-5 w-5", active ? "text-indigo-600" : "text-slate-400")} />
//                     {name}
//                   </button>
//                 );
//               })}
//             </nav>
//           </DisclosurePanel>
//         </>
//       )}
//     </Disclosure>
//   );
// }
