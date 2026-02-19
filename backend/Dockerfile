FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/ControleGastos.Api/ControleGastos.Api.csproj", "src/ControleGastos.Api/"]
COPY ["src/ControleGastos.Application/ControleGastos.Application.csproj", "src/ControleGastos.Application/"]
COPY ["src/ControleGastos.Domain/ControleGastos.Domain.csproj", "src/ControleGastos.Domain/"]
COPY ["src/ControleGastos.Infrastructure/ControleGastos.Infrastructure.csproj", "src/ControleGastos.Infrastructure/"]
RUN dotnet restore "src/ControleGastos.Api/ControleGastos.Api.csproj"
COPY . .
WORKDIR "/src/src/ControleGastos.Api"
RUN dotnet build "ControleGastos.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ControleGastos.Api.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ControleGastos.Api.dll"]
