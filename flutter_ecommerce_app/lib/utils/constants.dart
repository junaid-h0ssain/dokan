// API Endpoints
const String loginEndpoint = '/auth/login';
const String registerEndpoint = '/auth/register';
const String categoriesEndpoint = '/categories';
const String productsEndpoint = '/products';
const String cartEndpoint = '/cart';
const String ordersEndpoint = '/orders';

// Storage Keys
const String tokenStorageKey = 'jwt_token';
const String userStorageKey = 'user_data';
const String cartStorageKey = 'cart_data';

// Error Messages
const String networkErrorMessage = 'Network error. Please check your connection.';
const String authenticationErrorMessage = 'Authentication failed. Please try again.';
const String validationErrorMessage = 'Invalid input. Please check your data.';
const String serverErrorMessage = 'Server error. Please try again later.';
const String unknownErrorMessage = 'An unexpected error occurred.';

// Timeouts
const Duration apiTimeout = Duration(seconds: 30);
const Duration connectionTimeout = Duration(seconds: 10);

// Pagination
const int defaultPageSize = 20;
const int defaultPageNumber = 1;
