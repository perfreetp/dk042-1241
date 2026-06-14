import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Product, Industry, Favorite, Appointment, Communication,
  QuestionnaireResult, FilterOptions, DashboardStats, ProviderStats, Review, CaseStudy } from '@/types';
import { products, consultants, providers } from '@/data/mockData';

export interface UserReview {
  id: string;
  productId: string;
  productName: string;
  productLogo: string;
  rating: number;
  content: string;
  tags: string[];
  createdAt: string;
  helpful: number;
}

export interface ProviderCase {
  id: string;
  title: string;
  clientName: string;
  industry: Industry;
  description: string;
  results: string[];
  image: string;
  createdAt: string;
}

export interface InquiryReply {
  role: 'user' | 'me';
  content: string;
  time: string;
}

export interface ProviderInquiry {
  id: string;
  userName: string;
  userPhone: string;
  company: string;
  product: string;
  message: string;
  time: string;
  status: 'pending' | 'replied' | 'completed';
  replies: InquiryReply[];
}

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
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => string;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;

  communications: Communication[];
  addCommunication: (communication: Omit<Communication, 'id' | 'createdAt'>) => void;

  userReviews: UserReview[];
  addUserReview: (review: Omit<UserReview, 'id' | 'createdAt' | 'helpful'>) => void;
  updateUserReview: (id: string, updates: Partial<Pick<UserReview, 'rating' | 'content' | 'tags'>>) => void;

  providerCases: ProviderCase[];
  addProviderCase: (caseItem: Omit<ProviderCase, 'id' | 'createdAt'>) => void;
  removeProviderCase: (id: string) => void;

  providerInquiries: ProviderInquiry[];
  addProviderInquiryReply: (inquiryId: string, content: string) => void;
  addProviderInquiry: (inquiry: Omit<ProviderInquiry, 'id' | 'replies'>) => void;

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
      addAppointment: (appointment) => {
        const newId = `apt-${Date.now()}`;
        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        set((state) => ({
          appointments: [
            {
              ...appointment,
              id: newId,
              createdAt: new Date().toISOString(),
            },
            ...state.appointments,
          ],
        }));
        if (appointment.type === 'consultation') {
          set((state) => ({
            communications: [
              ...state.communications,
              {
                id: `comm-${Date.now()}`,
                appointmentId: newId,
                userId: 'user1',
                consultantId: appointment.consultantId,
                content: appointment.notes || '预约咨询',
                type: 'note' as const,
                createdAt: new Date().toISOString(),
              },
            ],
          }));
        }
        return newId;
      },
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

      userReviews: [
        {
          id: 'ur1',
          productId: 'prod1',
          productName: '美团收银专业版',
          productLogo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=meituan%20pos%20software%20logo&image_size=square',
          rating: 5,
          content: '用了半年了，系统很稳定，功能也很全面，特别是外卖对接功能太方便了。客服响应也很及时，有问题基本当天就能解决。',
          tags: ['功能齐全', '服务好', '稳定'],
          createdAt: '2024-03-15',
          helpful: 23,
        },
        {
          id: 'ur2',
          productId: 'prod3',
          productName: '客如云收银系统',
          productLogo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=keruyun%20pos%20logo%20orange&image_size=square',
          rating: 4,
          content: '性价比不错，基础功能都有，就是营销功能稍微弱了点。如果只是需要收银和库存管理的话完全够用。',
          tags: ['性价比高', '功能待完善'],
          createdAt: '2024-02-20',
          helpful: 15,
        },
      ],
      addUserReview: (review) =>
        set((state) => ({
          userReviews: [
            {
              ...review,
              id: `ur-${Date.now()}`,
              createdAt: new Date().toISOString().split('T')[0],
              helpful: 0,
            },
            ...state.userReviews,
          ],
        })),
      updateUserReview: (id, updates) =>
        set((state) => ({
          userReviews: state.userReviews.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),

      providerCases: [],
      addProviderCase: (caseItem) =>
        set((state) => ({
          providerCases: [
            {
              ...caseItem,
              id: `pc-${Date.now()}`,
              createdAt: new Date().toISOString().split('T')[0],
            },
            ...state.providerCases,
          ],
        })),
      removeProviderCase: (id) =>
        set((state) => ({
          providerCases: state.providerCases.filter((c) => c.id !== id),
        })),

      providerInquiries: [
        {
          id: 'pi1',
          userName: '李老板',
          userPhone: '138****8888',
          company: '美味餐饮店',
          product: '美团收银专业版',
          message: '想了解连锁门店的价格方案，我们有5家店',
          time: '10分钟前',
          status: 'pending',
          replies: [
            { role: 'user' as const, content: '想了解连锁门店的价格方案', time: '10:30' },
          ],
        },
        {
          id: 'pi2',
          userName: '王经理',
          userPhone: '139****6666',
          company: 'XX餐饮连锁',
          product: '美团餐饮供应链',
          message: '请问支持多少家门店的库存管理？',
          time: '1小时前',
          status: 'pending',
          replies: [
            { role: 'user' as const, content: '请问支持多少家门店的库存管理？', time: '09:45' },
          ],
        },
        {
          id: 'pi3',
          userName: '张总',
          userPhone: '137****9999',
          company: '张总餐饮集团',
          product: '美团收银专业版',
          message: '已经收到报价，考虑中',
          time: '昨天',
          status: 'replied',
          replies: [
            { role: 'user' as const, content: '报价单能再优惠点吗？', time: '昨天 14:30' },
            { role: 'me' as const, content: '您好，已经是最优惠价格了，我们还提供免费培训服务', time: '昨天 15:00' },
            { role: 'user' as const, content: '好的，我再考虑考虑', time: '昨天 15:30' },
          ],
        },
        {
          id: 'pi4',
          userName: '陈店长',
          userPhone: '136****5555',
          company: '陈记火锅',
          product: '美团收银专业版',
          message: '准备采购，约个时间上门演示',
          time: '2天前',
          status: 'completed',
          replies: [
            { role: 'user' as const, content: '准备采购，约个时间上门演示', time: '前天 10:00' },
            { role: 'me' as const, content: '好的，明天下午2点可以吗？', time: '前天 10:30' },
            { role: 'user' as const, content: '可以的，地址是...', time: '前天 11:00' },
          ],
        },
      ],
      addProviderInquiryReply: (inquiryId, content) =>
        set((state) => ({
          providerInquiries: state.providerInquiries.map((inq) =>
            inq.id === inquiryId
              ? {
                  ...inq,
                  status: 'replied' as const,
                  replies: [
                    ...inq.replies,
                    {
                      role: 'me' as const,
                      content,
                      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
                    },
                  ],
                }
              : inq
          ),
        })),
      addProviderInquiry: (inquiry) =>
        set((state) => ({
          providerInquiries: [
            {
              ...inquiry,
              id: `pi-${Date.now()}`,
              replies: [
                {
                  role: 'user' as const,
                  content: inquiry.message,
                  time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
                },
              ],
            },
            ...state.providerInquiries,
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

        if (filterOptions.afterSaleScope && filterOptions.afterSaleScope.length > 0) {
          result = result.filter((p) =>
            filterOptions.afterSaleScope!.every((scope) =>
              p.afterSaleScope.some((as) => as.includes(scope))
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
        const { favorites, appointments, userReviews } = get();
        return {
          totalFavorites: favorites.length,
          totalAppointments: appointments.length,
          pendingAppointments: appointments.filter((a) => a.status === 'pending').length,
          completedAppointments: appointments.filter((a) => a.status === 'completed').length,
          totalReviews: userReviews.length,
        };
      },

      getProviderStats: () => {
        const { providerCases, providerInquiries } = get();
        const providerProducts = products.filter((p) => p.providerId === 'p1');
        return {
          totalProducts: providerProducts.length,
          totalInquiries: providerInquiries.length,
          pendingInquiries: providerInquiries.filter((i) => i.status === 'pending').length,
          totalCases: providerCases.length + (products.find((p) => p.id === 'prod1')?.cases.length || 0),
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
        userReviews: state.userReviews,
        providerCases: state.providerCases,
        providerInquiries: state.providerInquiries,
      }),
    }
  )
);
