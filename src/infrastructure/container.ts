import {
  BrowseProductsUseCase,
  BrowseServicesUseCase,
  GetBookingAvailabilityUseCase,
  GetFeaturedReviewsUseCase,
  GetFeaturedServicesUseCase,
  GetMembershipTiersUseCase,
  GetProductDetailUseCase,
  GetProductsUseCase,
  GetReviewsUseCase,
  GetServiceCategoriesUseCase,
  GetServiceDetailUseCase,
  GetTherapistsUseCase,
  PlaceOrderUseCase,
  SearchSiteUseCase,
  SendContactMessageUseCase,
  SignInUseCase,
  SignUpUseCase,
  SubmitBookingUseCase,
  SubmitEnquiryUseCase,
  SubmitReviewUseCase,
} from "@/application";
import { InMemoryAuthRepository } from "./repositories/InMemoryAuthRepository";
import { InMemoryBookingRepository } from "./repositories/InMemoryBookingRepository";
import { InMemoryContactMessageRepository } from "./repositories/InMemoryContactMessageRepository";
import { InMemoryEnquiryRepository } from "./repositories/InMemoryEnquiryRepository";
import { InMemoryOrderRepository } from "./repositories/InMemoryOrderRepository";
import { InMemoryProductRepository } from "./repositories/InMemoryProductRepository";
import { InMemoryReviewSubmissionRepository } from "./repositories/InMemoryReviewSubmissionRepository";
import { InMemoryServiceRepository } from "./repositories/InMemoryServiceRepository";
import { InMemoryTherapistRepository } from "./repositories/InMemoryTherapistRepository";
import { MockAvailabilityRepository } from "./repositories/MockAvailabilityRepository";
import { StaticMembershipRepository } from "./repositories/StaticMembershipRepository";
import { StaticPageIndexRepository } from "./repositories/StaticPageIndexRepository";
import { StaticReviewRepository } from "./repositories/StaticReviewRepository";

/**
 * Composition root — the only place that knows which repository implementations
 * back the use cases. The presentation layer imports use cases from here.
 * To go live, swap the in-memory repositories for API/database ones.
 */
// Mutable stores (bookings, orders, enquiries, messages, review submissions, accounts) live on globalThis so they survive dev hot
// reloads; everything else is rebuilt with the module, so data edits show up immediately.
// Existing stores are kept; any store added since the cache was created is filled in.
const cache = globalThis as unknown as { __chyStores?: Partial<ReturnType<typeof createStores>> };
const stores = (cache.__chyStores = { ...createStores(), ...cache.__chyStores });

function createStores() {
  return {
    bookings: new InMemoryBookingRepository(),
    orders: new InMemoryOrderRepository(),
    enquiries: new InMemoryEnquiryRepository(),
    auth: new InMemoryAuthRepository(),
    contactMessages: new InMemoryContactMessageRepository(),
    reviewSubmissions: new InMemoryReviewSubmissionRepository(),
  };
}

function createContainer() {
  const services = new InMemoryServiceRepository();
  const products = new InMemoryProductRepository();
  const therapists = new InMemoryTherapistRepository();
  const availability = new MockAvailabilityRepository();
  const { bookings, orders, enquiries, auth, contactMessages, reviewSubmissions } = stores;
  const pages = new StaticPageIndexRepository();
  const reviews = new StaticReviewRepository();
  const memberships = new StaticMembershipRepository();

  return {
    getServiceCategories: new GetServiceCategoriesUseCase(services),
    browseServices: new BrowseServicesUseCase(services),
    getServiceDetail: new GetServiceDetailUseCase(services),
    getFeaturedServices: new GetFeaturedServicesUseCase(services),
    browseProducts: new BrowseProductsUseCase(products),
    getProductDetail: new GetProductDetailUseCase(products),
    getProducts: new GetProductsUseCase(products),
    searchSite: new SearchSiteUseCase(services, products, pages),
    getTherapists: new GetTherapistsUseCase(therapists),
    getBookingAvailability: new GetBookingAvailabilityUseCase(availability),
    submitBooking: new SubmitBookingUseCase(services, therapists, availability, bookings),
    placeOrder: new PlaceOrderUseCase(products, orders),
    getFeaturedReviews: new GetFeaturedReviewsUseCase(reviews),
    getReviews: new GetReviewsUseCase(reviews),
    submitReview: new SubmitReviewUseCase(reviewSubmissions),
    submitEnquiry: new SubmitEnquiryUseCase(enquiries),
    sendContactMessage: new SendContactMessageUseCase(contactMessages),
    getMembershipTiers: new GetMembershipTiersUseCase(memberships),
    signIn: new SignInUseCase(auth),
    signUp: new SignUpUseCase(auth),
  };
}

export type Container = ReturnType<typeof createContainer>;

export const container: Container = createContainer();
