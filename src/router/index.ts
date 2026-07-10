import { createRouter, createWebHistory } from 'vue-router'
import TripBoardView from '../views/TripBoardView.vue'
import TripDetailView from '../views/TripDetailView.vue'
import AdminAccessView from '../views/AdminAccessView.vue'
import AdminImportView from '../views/AdminImportView.vue'
import AdminTripListView from '../views/AdminTripListView.vue'
import AdminTripEditView from '../views/AdminTripEditView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'trip-board',
      component: TripBoardView,
    },
    {
      path: '/trip/:id',
      name: 'trip-detail',
      component: TripDetailView,
      props: true,
    },
    {
      path: '/admin',
      name: 'admin-access',
      component: AdminAccessView,
    },
    {
      path: '/admin/trips',
      name: 'admin-trips',
      component: AdminTripListView,
    },
    {
      path: '/admin/import',
      name: 'admin-import',
      component: AdminImportView,
    },
    {
      path: '/admin/trips/:id',
      name: 'admin-trip-edit',
      component: AdminTripEditView,
      props: true,
    },
  ],
})
