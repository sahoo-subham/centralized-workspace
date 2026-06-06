// components/Navbar.jsx

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { BellIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard' },
  { name: 'Teams'     },
  { name: 'Projects'  },
  { name: 'Tasks'     },
  { name: 'Documents' },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Navbar({ activePage, onNavigate, onLogout }) {
  return (
    <nav className="w-full bg-gray-800 border-b border-gray-700 px-6 h-16 flex items-center justify-between">

     
      <div className="flex items-center gap-6">
        <div></div>
        <img
          src="/icon.svg"
          alt="Logo"
          className="h-12 w-auto"
        />

        <div className="flex items-center gap-1">
          {navigation.map((item) => (
            <button
              key={item.name}
              onClick={() => onNavigate(item.name)}
              className={classNames(
                activePage === item.name
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                'px-4 py-2 rounded-md text-sm font-medium cursor-pointer border-none'
              )}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">

       
        <button className="text-gray-400 hover:text-white rounded-full p-1 border-none cursor-pointer">
          <BellIcon className="h-6 w-6" />
        </button>

       
        <Menu as="div" className="relative">
          <MenuButton className="flex rounded-full border-none cursor-pointer focus:outline-none">
            <img
              src="user.png"
              alt="profile"
              className="h-9 w-9 rounded-full ring-2 ring-gray-600"
            />
          </MenuButton>

          
          <MenuItems className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg ring-1 ring-black/30 z-50 focus:outline-none">
            <MenuItem>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-t-md profile"
              >
                Your Profile
              </a>
            </MenuItem>
            <MenuItem>
              <button
                onClick={onLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white bg-transparent border-none cursor-pointer rounded-b-md out"
              >
                Sign out
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>

      </div>
    </nav>
  )
}