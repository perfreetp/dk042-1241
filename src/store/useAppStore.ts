import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Product, Industry, Favorite, Appointment, Communication, QuestionnaireResult, FilterOptions, DashboardStats, ProviderStats } from '@/types';
import { products, consultants, providers } from '@/data/mockData';

interface AppState {
  currentIndustry: Industry;
  setCurrentIndustry: (industry: Industry) => void;

  favorites: Favorite[];
  addFavorite: (productId: string) => void;
  removeFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;

  compareList: string[];
  addToCompare: (productId: string) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;

  appointments: Appointment[];
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;

  communications: Communication[];
  addCommunication: (communication: Omit<Communication, 'id' | 'createdAt'>) => void;

  questionnaireResult: QuestionnaireResult | null;
  setQuestionnaireResult: (result: QuestionnaireResult) => void;

  filterOptions: FilterOptions;
  setFilterOptions: (options: Partial<FilterOptions>) => void;

  userRole: 'merchant' | 'provider' | 'consultant' | null;
  setUserRole: (role: 'merchant' | 'provider' | 'consultant' | null) => void;
  isLoggedIn: boolean;
  login: (role: 'merchant' | 'provider' | 'consultant') => void;
  logout: () => void;

  getProducts: () => Product[];
  getProductById: (id: string) => Product | undefined;
  getFilteredProducts: () => Product[];
  getDashboardStats: () => DashboardStats;
  getProviderStats: () => ProviderStats;
  getCompareProducts: () => Product[];
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentIndustry: '餐饮',
      setCurrentIndustry: (industry) => set({ currentIndustry: industry }),

      favorites: [],
      addFavorite: (productId) =>
        set((state) => {
          if (state.favorites.some((f) => f.productId === productId)) return state;
          return {
            favorites: [
              ...state.favorites,
              {
                id: `fav-${Date.now()}`,
                userId: 'user1',
                productId,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }),
      removeFavorite: (productId) =>
        set((state) => ({
        favorites: state.favorites.filter((f) => f.productId !== productId),
      })),
      isFavorite: (productId) => get().favorites.some((f) => f.productId === productId),

      compareList: [],
      addToCompare: (productId) =>
        set((state) => {
          if (state.compareList.length >= 4) return state;
          if (state.compareList.includes(productId)) return state;
          return { compareList: [...state.compareList, productId] };
        }),
      removeFromCompare: (productId) =>
        set((state) => ({
          compareList: state.compareList.filter((id) => id !== productId),
        })),
      clearCompare: () => set({ compareList: [] }),
      isInCompare: (productId) => get().compareList.includes(productId),

      appointments: [
        {
          id: 'apt1',
          userId: 'user1',
          userName: '测试用户',
          productId: 'prod1',
          productName: '美团收银专业版',
          consultantId: 'c1',
          consultantName: '张顾问',
          type: 'demo',
          date: '2024-06-20',
          time: '14:00',
          status: 'confirmed',
          notes: '想了解连锁门店管理功能',
          createdAt: '2024-06-10',
        },
        {
          id: 'apt2',
          userId: 'user1',
          userName: '测试用户',
          consultantId: 'c2',
          consultantName: '李顾问',
          type: 'consultation',
          date: '2024-06-25',
          time: '10:00',
          status: 'pending',
          notes: '美业门店系统选型咨询',
          createdAt: '2024-06-12',
        },
      ],
      addAppointment: (appointment) =>
        set((state) => ({
          appointments: [
            ...state.appointments,
            {
              ...appointment,
              id: `apt-${Date.now()}`,
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      updateAppointmentStatus: (id, status) =>
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id ? { ...a, status } : a
          ),
        })),

      communications: [
        {
          id: 'comm1',
          appointmentId: 'apt1',
          userId: 'user1',
          consultantId: 'c1',
          content: '已发送产品资料和报价单，请查收',
          type: 'note',
          createdAt: '2024-06-11',
        },
        {
          id: 'comm2',
          appointmentId: 'apt1',
          userId: 'user1',
          consultantId: 'c1',
          content: '电话沟通确认演示时间和地址',
          type: 'call',
          createdAt: '2024-06-15',
        },
      ],
      addCommunication: (communication) =>
        set((state) => ({
          communications: [
            ...state.communications,
            {
              ...communication,
              id: `comm-${Date.now()}`,
              createdAt: new Date().toISOString(),
            },
          ],
        })),

      questionnaireResult: null,
      setQuestionnaireResult: (result) => set({ questionnaireResult: result }),

      filterOptions: {},
      setFilterOptions: (options) =>
        set((state) => ({
          filterOptions: { ...state.filterOptions, ...options },
        })),

      userRole: null,
      setUserRole: (role) => set({ userRole: role }),
      isLoggedIn: false,
      login: (role) => set({ userRole: role, isLoggedIn: true }),
      logout: () => set({ userRole: null, isLoggedIn: false }),

      getProducts: () => products,

      getProductById: (id) => products.find((p) => p.id === id),

      getFilteredProducts: () => {
        const { filterOptions, currentIndustry } = get();
        let result = [...products];

        if (filterOptions.industry || currentIndustry) {
          const industry = filterOptions.industry || currentIndustry;
          result = result.filter((p) => p.industry === industry);
        }

        if (filterOptions.priceMin !== undefined) {
          result = result.filter((p) => p.priceMin >= filterOptions.priceMin!);
        }

        if (filterOptions.priceMax !== undefined) {
          result = result.filter((p) => p.priceMax <= filterOptions.priceMax!);
        }

        if (filterOptions.minRating) {
          result = result.filter((p) => p.rating >= filterOptions.minRating!);
        }

        if (filterOptions.features && filterOptions.features.length > 0) {
          result = result.filter((p) =>
            filterOptions.features!.every((f) =>
              p.features.some((pf) => pf.name === f && pf.hasFeature)
            )
          );
        }

        if (filterOptions.search) {
          const search = filterOptions.search.toLowerCase();
          result = result.filter(
            (p) =>
              p.name.toLowerCase().includes(search) ||
              p.description.toLowerCase().includes(search) ||
              p.tags.some((t) => t.toLowerCase().includes(search))
          );
        }

        if (filterOptions.sortBy) {
          switch (filterOptions.sortBy) {
            case 'rating':
              result.sort((a, b) => b.rating - a.rating);
              break;
            case 'price-asc':
              result.sort((a, b) => a.priceMin - b.priceMin);
              break;
            case 'price-desc':
              result.sort((a, b) => b.priceMin - a.priceMin);
              break;
            case 'reviewCount':
              result.sort((a, b) => b.reviewCount - a.reviewCount);
              break;
          }
        }

        return result;
      },

      getDashboardStats: () => {
        const { favorites, appointments } = get();
        return {
          totalFavorites: favorites.length,
          totalAppointments: appointments.length,
          pendingAppointments: appointments.filter((a) => a.status === 'pending').length,
          completedAppointments: appointments.filter((a) => a.status === 'completed').length,
          totalReviews: 0,
        };
      },

      getProviderStats: () => {
        const providerProducts = products.filter((p) => p.providerId === 'p1');
        return {
          totalProducts: providerProducts.length,
          totalInquiries: 45,
          pendingInquiries: 12,
          totalCases: 8,
          avgRating: 4.7,
          totalViews: 2340,
        };
      },

      getCompareProducts: () => {
        const { compareList } = get();
        return products.filter((p) => compareList.includes(p.id));
      },
    }),
    {
      name: 'saas-selector-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        compareList: state.compareList,
        appointments: state.appointments,
        communications: state.communications,
        questionnaireResult: state.questionnaireResult,
        userRole: state.userRole,
        isLoggedIn: state.isLoggedIn,
        currentIndustry: state.currentIndustry,
      }),
    }
  )
);
