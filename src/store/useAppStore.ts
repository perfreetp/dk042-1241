import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  Product, Industry, Favorite, Appointment, AppointmentFollowup, Communication,
  QuestionnaireResult, FilterOptions, DashboardStats, ProviderStats, Review, CaseStudy } from '@/types';
import { products, consultants, providers } from '@/data/mockData';

export interface UserReview {
  id: string;
  userId?: string;
  userName: string;
  productId: string;
  productName: string;
  productLogo: string;
  providerId?: string;
  providerName?: string;
  rating: number;
  content: string;
  tags: string[];
  createdAt: string;
  helpful: number;
  officialReply?: {
    content: string;
    replierName: string;
    replyTime: string;
  };
}

export interface ReviewAggregate {
  ratingDistribution: Record<number, number>;
  tagStats: Array<{ tag: string; count: number }>;
  reviewsSorted: Array<Review & {
    productName?: string; productLogo?: string; helpful?: number; userId?: string;
    userName: string; tags: string[]; rating: number; content: string; createdAt: string;
    officialReply?: UserReview['officialReply'];
  }>;
  totalCount: number;
  averageRating: number;
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
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt' | 'followups'>) => string;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  updateAppointmentDetail: (id: string, updates: Partial<Pick<Appointment, 'date' | 'time' | 'userPhone' | 'userCompany' | 'notes'>>) => void;
  addAppointmentFollowup: (id: string, content: string) => void;

  communications: Communication[];
  addCommunication: (communication: Omit<Communication, 'id' | 'createdAt'>) => void;

  userReviews: UserReview[];
  addUserReview: (review: Omit<UserReview, 'id' | 'createdAt' | 'helpful'>) => void;
  updateUserReview: (id: string, updates: Partial<Pick<UserReview, 'rating' | 'content' | 'tags'>>) => void;
  getProductReviewAggregate: (productId: string) => ReviewAggregate;
  replyToReview: (reviewId: string, content: string, replierName?: string) => void;
  getProviderReviews: (providerId?: string) => UserReview[];

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

  savedFilters: Array<{ id: string; name: string; filterOptions: FilterOptions; createdAt: string }>;
  saveFilter: (name: string, filterOptions: FilterOptions) => void;
  deleteSavedFilter: (id: string) => void;
  applySavedFilter: (id: string) => void;

  userRole: 'merchant' | 'provider' | 'consultant' | null;
  setUserRole: (role: 'merchant' | 'provider' | 'consultant' | null) => void;
  isLoggedIn: boolean;
  login: (role: 'merchant' | 'provider' | 'consultant') => void;
  logout: () => void;

  getProducts: () => Product[];
  getProductById: (id: string) => Product | undefined;
  getFilteredProducts: () => Product[];
  getDashboardStats: () => DashboardStats;
  getProviderStats: (providerId?: string) => ProviderStats;
  getCompareProducts: () => Product[];
  getProviderAppointments: (providerId?: string) => Appointment[];
  getProductReviews: (productId: string) => Review[];
  getProductRating: (productId: string) => { rating: number; reviewCount: number };
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
          userPhone: '138****8888',
          userCompany: '美味餐饮店',
          productId: 'prod1',
          productName: '美团收银专业版',
          providerId: 'p1',
          providerName: '美团餐饮系统',
          consultantId: 'c1',
          consultantName: '张顾问',
          type: 'demo',
          date: '2024-06-20',
          time: '14:00',
          status: 'confirmed',
          notes: '想了解连锁门店管理功能',
          createdAt: '2024-06-10',
          followups: [
            {
              id: 'f1',
              action: 'created' as const,
              operatorName: '测试用户',
              operatorRole: 'merchant' as const,
              content: '提交预约申请，希望了解连锁门店管理功能',
              createdAt: '2024-06-10 09:30',
            },
            {
              id: 'f2',
              action: 'confirmed' as const,
              operatorName: '美团餐饮系统',
              operatorRole: 'provider' as const,
              content: '预约已确认，张顾问将按时联系你确认演示细节',
              createdAt: '2024-06-11 10:15',
            },
          ],
        },
        {
          id: 'apt2',
          userId: 'user1',
          userName: '测试用户',
          userPhone: '138****8888',
          consultantId: 'c2',
          consultantName: '李顾问',
          type: 'consultation',
          date: '2024-06-25',
          time: '10:00',
          status: 'pending',
          notes: '美业门店系统选型咨询',
          createdAt: '2024-06-12',
          followups: [
            {
              id: 'f3',
              action: 'created' as const,
              operatorName: '测试用户',
              operatorRole: 'merchant' as const,
              content: '提交顾问咨询预约，咨询美业门店系统选型',
              createdAt: '2024-06-12 14:20',
            },
          ],
        },
      ],
      addAppointment: (appointment) => {
        const newId = `apt-${Date.now()}`;
        const product = appointment.productId
          ? products.find((p) => p.id === appointment.productId)
          : undefined;
        const providerId = product?.providerId;
        const providerName = product?.providerName;
        const now = new Date();
        const createdAtStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        set((state) => ({
          appointments: [
            {
              ...appointment,
              id: newId,
              providerId,
              providerName,
              createdAt: new Date().toISOString(),
              followups: [
                {
                  id: `f-${Date.now()}`,
                  action: 'created' as const,
                  operatorName: appointment.userName,
                  operatorRole: 'merchant' as const,
                  content: appointment.notes || `提交${appointment.type === 'demo' ? '产品演示' : '顾问咨询'}预约`,
                  createdAt: createdAtStr,
                },
              ],
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
      updateAppointmentStatus: (id, status) => {
        const now = new Date();
        const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const statusContent: Record<Appointment['status'], string> = {
          pending: '预约状态更新为待确认',
          confirmed: '预约已确认，请按约定时间进行沟通',
          completed: '预约已完成，后续可查看评价反馈',
          cancelled: '预约已取消',
        };
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id ? {
              ...a,
              status,
              followups: [
                ...(a.followups || []),
                {
                  id: `fup-${Date.now()}`,
                  action: status as AppointmentFollowup['action'],
                  operatorName: a.providerName || '服务商',
                  operatorRole: 'provider' as const,
                  content: statusContent[status],
                  createdAt: timeStr,
                },
              ],
            } : a
          ),
        }));
      },
      updateAppointmentDetail: (id, updates) => {
        const now = new Date();
        const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const changes: string[] = [];
        if (updates.date || updates.time) changes.push('修改了预约时间');
        if (updates.userPhone || updates.userCompany) changes.push('更新了联系人信息');
        if (updates.notes) changes.push('补充了预约备注');
        set((state) => ({
          appointments: state.appointments.map((a) => {
            if (a.id !== id) return a;
            return {
              ...a,
              ...updates,
              followups: [
                ...(a.followups || []),
                ...(changes.length > 0 ? [{
                  id: `fup-detail-${Date.now()}`,
                  action: 'note' as const,
                  operatorName: a.providerName || '服务商',
                  operatorRole: 'provider' as const,
                  content: changes.join('；'),
                  createdAt: timeStr,
                }] : []),
              ],
            };
          }),
        }));
      },
      addAppointmentFollowup: (id, content) => {
        const now = new Date();
        const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        set((state) => ({
          appointments: state.appointments.map((a) =>
            a.id === id ? {
              ...a,
              followups: [
                ...(a.followups || []),
                {
                  id: `fup-note-${Date.now()}`,
                  action: 'note' as const,
                  operatorName: a.providerName || '服务商',
                  operatorRole: 'provider' as const,
                  content,
                  createdAt: timeStr,
                },
              ],
            } : a
          ),
        }));
      },

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
          userId: 'user1',
          userName: '陈老板',
          productId: 'prod1',
          productName: '美团收银专业版',
          productLogo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=meituan%20pos%20software%20logo&image_size=square',
          providerId: 'p1',
          providerName: '美团餐饮系统',
          rating: 5,
          content: '用了半年了，系统很稳定，功能也很全面，特别是外卖对接功能太方便了。客服响应也很及时，有问题基本当天就能解决。',
          tags: ['功能齐全', '服务好', '稳定'],
          createdAt: '2024-03-15',
          helpful: 23,
          officialReply: {
            content: '感谢陈老板的认可！后续如需扩展连锁门店管理功能，欢迎随时联系专属顾问，我们会继续提供优质服务。',
            replierName: '美团餐饮系统',
            replyTime: '2024-03-16 14:20',
          },
        },
        {
          id: 'ur2',
          userId: 'user2',
          userName: '王店长',
          productId: 'prod3',
          productName: '客如云收银系统',
          productLogo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=keruyun%20pos%20logo%20orange&image_size=square',
          providerId: 'p3',
          providerName: '客如云',
          rating: 4,
          content: '性价比不错，基础功能都有，就是营销功能稍微弱了点。如果只是需要收银和库存管理的话完全够用。',
          tags: ['性价比高', '功能待完善'],
          createdAt: '2024-02-20',
          helpful: 15,
        },
        {
          id: 'ur3',
          userId: 'user1',
          userName: '测试用户',
          productId: 'prod4',
          productName: '校宝 SCRM',
          productLogo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=xiaobao%20education%20software%20logo&image_size=square',
          providerId: 'p4',
          providerName: '校宝在线',
          rating: 5,
          content: '招生转化功能很好用，学员管理和考勤系统也很完善，老师上课点名很方便，家长端也能实时看到动态。',
          tags: ['招生神器', '学员管理好', '服务好'],
          createdAt: '2024-04-02',
          helpful: 18,
        },
        {
          id: 'ur4',
          userId: 'user2',
          userName: '李校长',
          productId: 'prod4',
          productName: '校宝 SCRM',
          productLogo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=xiaobao%20education%20software%20logo&image_size=square',
          providerId: 'p4',
          providerName: '校宝在线',
          rating: 4,
          content: '整体不错，数据报表比较丰富，续费提醒功能帮了大忙。就是财务对账还有些细节可以优化。',
          tags: ['数据好', '功能齐全'],
          createdAt: '2024-04-18',
          helpful: 9,
        },
        {
          id: 'ur5',
          userId: 'user1',
          userName: '张医生',
          productId: 'prod5',
          productName: '微医云诊所',
          productLogo: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=weiyi%20clinic%20medical%20software%20logo%20blue&image_size=square',
          providerId: 'p5',
          providerName: '微医',
          rating: 5,
          content: '电子病历开方特别方便，医保对接也顺利，药品库存效期预警避免了过期损失，大大提高了诊所效率。',
          tags: ['电子病历方便', '医保对接', '库存预警'],
          createdAt: '2024-03-28',
          helpful: 31,
          officialReply: {
            content: '感谢张医生推荐！电子病历模板、智能处方系统会持续迭代升级，有任何需求欢迎反馈给我们的客户成功团队。',
            replierName: '微医云诊所',
            replyTime: '2024-03-29 10:10',
          },
        },
      ],
      addUserReview: (review) => {
        const product = products.find((p) => p.id === review.productId);
        set((state) => ({
          userReviews: [
            {
              ...review,
              id: `ur-${Date.now()}`,
              createdAt: new Date().toISOString().split('T')[0],
              helpful: 0,
              providerId: product?.providerId,
              providerName: product?.providerName,
            },
            ...state.userReviews,
          ],
        }));
      },
      updateUserReview: (id, updates) =>
        set((state) => ({
          userReviews: state.userReviews.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          ),
        })),
      getProductReviewAggregate: (productId) => {
        const state = get();
        const productReviews = state.getProductReviews(productId);
        const ratingDistribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        const tagCountMap = new Map<string, number>();
        let totalRating = 0;
        productReviews.forEach((r) => {
          ratingDistribution[r.rating] = (ratingDistribution[r.rating] || 0) + 1;
          totalRating += r.rating;
          r.tags.forEach((t) => {
            tagCountMap.set(t, (tagCountMap.get(t) || 0) + 1);
          });
        });
        const tagStats = Array.from(tagCountMap.entries())
          .map(([tag, count]) => ({ tag, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
        const reviewsSorted = [...productReviews].sort((a, b) => {
          const da = new Date(a.createdAt).getTime();
          const db = new Date(b.createdAt).getTime();
          return db - da;
        });
        const totalCount = productReviews.length;
        const averageRating = totalCount > 0 ? totalRating / totalCount : 0;
        return {
          ratingDistribution,
          tagStats,
          reviewsSorted,
          totalCount,
          averageRating,
        };
      },
      replyToReview: (reviewId, content, replierName) => {
        const now = new Date();
        const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        set((state) => ({
          userReviews: state.userReviews.map((r) => {
            if (r.id !== reviewId) return r;
            return {
              ...r,
              officialReply: {
                content,
                replierName: replierName || r.providerName || '官方',
                replyTime: timeStr,
              },
            };
          }),
        }));
      },
      getProviderReviews: (providerId) => {
        const state = get();
        const provider = providerId || 'p1';
        return state.userReviews.filter((r) => r.providerId === provider);
      },

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

      savedFilters: [
        {
          id: 'sf1',
          name: '餐饮高性价比',
          filterOptions: { industry: '餐饮', priceMax: 200, minRating: 4 },
          createdAt: '2024-06-01',
        },
        {
          id: 'sf2',
          name: '教育全能型',
          filterOptions: { industry: '教育', minRating: 4.5, features: ['会员管理', '营销推广', '数据分析'] },
          createdAt: '2024-06-05',
        },
      ],
      saveFilter: (name, filterOptions) =>
        set((state) => ({
          savedFilters: [
            {
              id: `sf-${Date.now()}`,
              name,
              filterOptions,
              createdAt: new Date().toISOString().split('T')[0],
            },
            ...state.savedFilters,
          ],
        })),
      deleteSavedFilter: (id) =>
        set((state) => ({
          savedFilters: state.savedFilters.filter((f) => f.id !== id),
        })),
      applySavedFilter: (id) =>
        set((state) => {
          const target = state.savedFilters.find((f) => f.id === id);
          if (!target) return state;
          return { filterOptions: { ...target.filterOptions } };
        }),

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

        if (filterOptions.industry) {
          result = result.filter((p) => p.industry === filterOptions.industry!);
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

      getProviderStats: (providerId = 'p1') => {
        const { providerCases, providerInquiries, appointments, userReviews } = get();
        const providerProducts = products.filter((p) => p.providerId === providerId);
        const providerAppointments = appointments.filter((a) => a.providerId === providerId);
        const providerReviews = userReviews.filter((r) => r.providerId === providerId);
        const avg = providerReviews.length > 0
          ? providerReviews.reduce((s, r) => s + r.rating, 0) / providerReviews.length
          : 4.7;
        return {
          totalProducts: providerProducts.length,
          totalInquiries: providerInquiries.length,
          pendingInquiries: providerInquiries.filter((i) => i.status === 'pending').length,
          totalCases: providerCases.length + (products.find((p) => p.id === 'prod1')?.cases.length || 0),
          avgRating: Math.round(avg * 10) / 10,
          totalViews: 2340,
          totalAppointments: providerAppointments.length,
          pendingAppointments: providerAppointments.filter((a) => a.status === 'pending').length,
        };
      },

      getCompareProducts: () => {
        const { compareList } = get();
        return products.filter((p) => compareList.includes(p.id));
      },

      getProviderAppointments: (providerId = 'p1') => {
        const { appointments } = get();
        return appointments.filter((a) => a.providerId === providerId);
      },

      getProductReviews: (productId) => {
        const { userReviews } = get();
        const product = products.find((p) => p.id === productId);
        const mockReviews = product?.reviews || [];
        const userReviewsForProduct = userReviews
          .filter((r) => r.productId === productId)
          .map((r) => ({
            id: r.id,
            productId: r.productId,
            userId: 'user1',
            userName: r.productName ? '我' : '匿名用户',
            userAvatar: r.productLogo,
            rating: r.rating,
            content: r.content,
            tags: r.tags,
            createdAt: r.createdAt,
          })) as Review[];
        return [...userReviewsForProduct, ...mockReviews];
      },

      getProductRating: (productId) => {
        const { userReviews } = get();
        const product = products.find((p) => p.id === productId);
        const mockReviews = product?.reviews || [];
        const userReviewsForProduct = userReviews.filter((r) => r.productId === productId);
        const allReviews = [...userReviewsForProduct, ...mockReviews];
        if (allReviews.length === 0) return { rating: 0, reviewCount: 0 };
        const sum = allReviews.reduce((acc, r) => acc + r.rating, 0);
        return {
          rating: Math.round((sum / allReviews.length) * 10) / 10,
          reviewCount: allReviews.length,
        };
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
        savedFilters: state.savedFilters,
      }),
    }
  )
);
