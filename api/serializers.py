from rest_framework import serializers
from rest_framework_gis.serializers import GeoFeatureModelSerializer

from alerts.models import Alert
from accounts.models import User


class AlertSerializer(GeoFeatureModelSerializer):
    class Meta:
        model = Alert
        geo_field = 'location'
        fields = ('pk','status', 'reported_by', 'emergency_type', 'description', 'location','time', 'response_time', 'location_name', 'image')


class UserRegistrationSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(style={'input_type':'password'}, write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password2', 'residence', 'mobile_no', 'first_name', 'last_name',]
    
    def save(self, request):
        user = User(
            username=self.validated_data['username'],
            email=self.validated_data['email'],
            residence=self.validated_data['residence'],
            mobile_no=self.validated_data['mobile_no'],
            first_name=self.validated_data['first_name'],
            last_name=self.validated_data['last_name']
        )

        password = self.validated_data['password']
        password2 = self.validated_data['password2']

        if password != password2:
            raise serializers.ValidationError({'password':"Password don't match"})
        user.set_password(password2)
        user.save()
        return user