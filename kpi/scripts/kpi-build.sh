# Stop currently runing service if it is runing as a service
if sudo systemctl is-active --quiet kpi.service
then sudo systemctl stop kpi.service
fi

# Remove previous version of the service file
sudo rm -f /etc/systemd/system/kpi.service

# Stop currently runing kpi.dll if it wasn't runing as a service
unset PID
PID=$(ps aux | grep '[k]pi.dll' | awk '{print $2}')
if [ ! -z "$PID" ]
then while sudo kill $PID
do sleep 1
done
fi
unset PID

# Change to directory with kpi.csproj
cd /var/aspnetcore/kpi/kpi

# Copy new version of the service file to replace the previous on
sudo cp system/kpi.service /etc/systemd/system/

# Remove previous version of the main application directory
sudo rm -fr /var/aspnetcore/kpi-app

# Publish compile new version of application
sudo dotnet publish -o /var/aspnetcore/kpi-app -c Release

# Change directory with kpi.dll
cd /var/aspnetcore/kpi-app

# Remove source code directory
sudo rm -r /var/aspnetcore/kpi

# Reload service files
sudo systemctl daemon-reload

# Restart the application service
sudo systemctl restart kpi.service
