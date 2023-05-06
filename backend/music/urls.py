from django.urls import path, include

# from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.routers import DefaultRouter
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from green_auth import views

from music.views import AlbumViewSet, ReviewViewSet, ArtistViewSet

router = DefaultRouter()
router.register("albums", AlbumViewSet)
router.register("reviews", ReviewViewSet)
router.register("artists", ArtistViewSet)
router.register(r'jwt/login', views.LoginViewSet, basename='jwt_obtain_pair')
router.register(r'jwt/refresh', views.RefreshViewSet, basename='jwt_refresh')

urlpatterns = [
    path('get-details', views.UserDetailAPI.as_view()),
    path('register', views.RegisterUserAPIView.as_view()),
    path("", include(router.urls)),
    path('accounts/', include('rest_registration.api.urls'))
]

# urlpatterns += [path('api-token-auth', obtain_auth_token),
#                 path('auth/', include('rest_framework.urls')),
#                 path("jwt/", TokenObtainPairView.as_view(),
#                      name="jwt_obtain_pair"),
#                 path("jwt/refresh/", TokenRefreshView.as_view(),
#                      name="jwt_refresh"),
#                 path("jwt/", TokenObtainPairView.as_view(),
#                      name="jwt_obtain_pair"),
#                 path("jwt/refresh/", TokenRefreshView.as_view(),
#                      name="jwt_refresh"),
#                 ]
