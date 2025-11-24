import { RouterProvider } from 'react-router-dom';

// routing
import router from 'routes';

import { Provider } from 'react-redux';
import {store} from './app/store';

// project imports
import NavigationScroll from 'layout/NavigationScroll';

import ThemeCustomization from 'themes';

// auth provider

// ==============================|| APP ||============================== //

export default function App() {
  return (
    <Provider store={store}>
    <ThemeCustomization>
      <NavigationScroll>
        <>
          <RouterProvider router={router} />
        </>
      </NavigationScroll>
    </ThemeCustomization>
    </Provider>
  );
}

// import { RouterProvider } from 'react-router-dom';
// import router from 'routes';

// // redux
// import { Provider } from 'react-redux';
// import store from './app/store';

// // project imports
// import NavigationScroll from 'layout/NavigationScroll';
// import ThemeCustomization from 'themes';

// export default function App() {
//   return (
//     <Provider store={store}>
//       <ThemeCustomization>
//         <NavigationScroll>
//           <RouterProvider router={router} />
//         </NavigationScroll>
//       </ThemeCustomization>
//     </Provider>
//   );
// }

