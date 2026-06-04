import { Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
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
    <Disclosure as="nav" className="relative bg-gray-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10">
    
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">

          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
           
            <div className="flex shrink-0 items-center">
              <img
                alt="Your Company"
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                className="h-8 w-auto"
              />
            </div>

            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {navigation.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => onNavigate(item.name)}
                    className={classNames(
                      activePage === item.name
                        ? 'bg-gray-950/50 text-white'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white',
                      'rounded-md px-3 py-2 text-sm font-medium border-none bg-transparent cursor-pointer'
                    )}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            <button type="button" className="relative rounded-full p-1 text-gray-400 hover:text-white">
              <BellIcon className="size-6" />
            </button>

            <Menu as="div" className="relative ml-3">
              <MenuButton className="relative flex rounded-full">
                <img
                  alt="profile"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  className="size-8 rounded-full bg-gray-800"
                />
              </MenuButton>

              <MenuItems className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-gray-800 py-1 outline -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:opacity-0 data-enter:duration-100 data-leave:duration-75">
                <MenuItem>
                  <a href="#" className="block px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5">
                    Your Profile
                  </a>
                </MenuItem>
                <MenuItem>
                  <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 data-focus:bg-white/5 bg-transparent border-none cursor-pointer"
                  >
                    Sign out
                  </button>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>

        </div>
      </div>

      <DisclosurePanel className="sm:hidden">
        <div className="space-y-1 px-2 pt-2 pb-3">
          {navigation.map((item) => (
            <DisclosureButton
              key={item.name}
              as="button"
              onClick={() => onNavigate(item.name)}
              className={classNames(
                activePage === item.name
                  ? 'bg-gray-950/50 text-white'
                  : 'text-gray-300 hover:bg-white/5 hover:text-white',
                'block w-full text-left rounded-md px-3 py-2 text-base font-medium border-none bg-transparent cursor-pointer'
              )}
            >
              {item.name}
            </DisclosureButton>
          ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}