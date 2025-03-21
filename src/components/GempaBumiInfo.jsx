import React, { useEffect, useState, useCallback } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";

const GempaBumiInfo = () => {
  const [dataGempa, setDataGempa] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  const fetchGempaData = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json"
      );
      const newData = response.data.Infogempa.gempa;

      if (!lastUpdate || newData.Jam !== lastUpdate) {
        setDataGempa(newData);
        setLastUpdate(newData.Jam);
      }
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("❌ Gagal mengambil data. Silakan coba lagi nanti.");
    } finally {
      setLoading(false);
    }
  }, [lastUpdate]);

  useEffect(() => {
    fetchGempaData();
    const interval = setInterval(fetchGempaData, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (lastUpdate) {
      toast.success("Data gempa terbaru ditemukan!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  }, [lastUpdate]);

  useEffect(() => {
    fetchGempaData();
    const interval = setInterval(fetchGempaData, 60000);
    return () => clearInterval(interval);
  }, [fetchGempaData]);

  const getMagnitudeColor = (magnitude) => {
    if (!magnitude) return "magnitude-gray";
    const mag = parseFloat(magnitude);

    const style = document.documentElement.style;

    if (mag >= 5.0 && mag < 6.0) {
      style.setProperty("--magnitude-bg-color", "#f97316"); // orange-500
      style.setProperty("--magnitude-text-color", "#ffffff");
      return "magnitude-orange";
    } else if (mag >= 6.0 && mag < 7.0) {
      style.setProperty("--magnitude-bg-color", "#ef4444"); // red-500
      style.setProperty("--magnitude-text-color", "#ffffff");
      return "magnitude-red";
    } else if (mag >= 7.0) {
      style.setProperty("--magnitude-bg-color", "#b91c1c"); // red-700
      style.setProperty("--magnitude-text-color", "#ffffff");
      return "magnitude-dark-red";
    }
    return "magnitude-gray";
  };

  if (loading && !dataGempa) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-t-blue-600 border-blue-200 rounded-full animate-spin mb-4"></div>
        <div className="text-blue-600 text-xl font-bold">
          Sedang memuat data gempa terbaru...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100 flex flex-col items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 mb-12 w-full max-w-4xl"
      >
        <div className="relative">
          {/* Decorative elements */}
          <div className="absolute -top-24 left-1/2 transform -translate-x-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-72 h-72 bg-gradient-to-br from-red-400/20 to-amber-400/20 rounded-full blur-3xl"></div>

          {/* Main header content */}
          <div className="text-center relative">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center mb-4 relative"
            >
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-blue-600/20 rounded-full blur-xl transform animate-pulse"></span>
              </span>
            </motion.div>

            <div className="flex items-center justify-center gap-3 flex-wrap">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-2.5 rounded-full shadow-lg border border-blue-100"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                </span>
                <span className="text-blue-800 font-medium">
                  Data terkini dari BMKG Indonesia
                </span>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Rest of the component */}
      <AnimatePresence>
        {error ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg mb-6 max-w-lg w-full backdrop-blur-sm"
          >
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          </motion.div>
        ) : (
          dataGempa && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-4xl px-4 sm:px-6 relative z-10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-3xl blur-3xl transform -rotate-6"></div>
              <Card className="bg-white/90 backdrop-blur-md border-0 overflow-hidden rounded-3xl shadow-2xl relative">
                <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-purple-700 p-4 md:p-6 text-white border-b relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNTYiIGhlaWdodD0iMTAwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDU2IDEwMCBIIDAgTCAwIDAgTCA1NiAwIEwgNTYgMTAwIiBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LDI1NSwyNTUsMC4xKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30"></div>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0 relative z-10">
                    <div className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2 animate-pulse"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7z"
                        />
                      </svg>
                      <span className="font-bold text-xl md:text-2xl">
                        Info Gempa Terkini
                      </span>
                    </div>
                    <div className="bg-blue-800/50 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold shadow-inner">
                      {dataGempa.Tanggal} · {dataGempa.Jam}
                    </div>
                  </div>
                </div>

                <CardContent className="p-4 md:p-6 relative">
                  <div className="space-y-6">
                    {/* Magnitude and Depth Section */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                      <motion.div
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="flex-1 glassmorphism rounded-2xl p-4 md:p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        <div className="text-sm text-gray-500 font-medium mb-1">
                          Kekuatan Gempa
                        </div>
                        <div className="flex items-center">
                          <div
                            className={`magnitude-display relative inline-flex items-center justify-center text-4xl font-bold px-6 py-3 rounded-lg ${getMagnitudeColor(
                              dataGempa?.Magnitude
                            )}`}
                          >
                            {dataGempa?.Magnitude}
                          </div>
                          <span className="ml-3 text-gray-700 font-medium">
                            Magnitudo
                          </span>
                        </div>
                      </motion.div>

                      <motion.div
                        whileHover={{ scale: 1.02, y: -5 }}
                        className="flex-1 glassmorphism rounded-2xl p-4 md:p-6 border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-300"
                      >
                        <div className="text-sm text-gray-500 font-medium mb-1">
                          Kedalaman
                        </div>
                        <div className="flex items-center">
                          <div className="text-4xl font-bold text-blue-600">
                            {dataGempa.Kedalaman.split(" ")[0]}
                          </div>
                          <div className="ml-2 text-gray-700">
                            {dataGempa.Kedalaman.includes(" ")
                              ? dataGempa.Kedalaman.split(" ")[1]
                              : "km"}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                    {/* Location Information */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 md:p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 space-y-4"
                    >
                      <div className="text-gray-800 font-medium flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2 text-blue-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        Lokasi Gempa
                      </div>

                      <div>
                        <div className="text-sm text-gray-500">Wilayah:</div>
                        <div className="text-xl font-medium text-gray-800">
                          {dataGempa.Wilayah}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500">Koordinat:</div>
                        <div className="text-lg text-gray-800">
                          {dataGempa.Lintang}, {dataGempa.Bujur}
                        </div>
                      </div>

                      <div>
                        <div className="text-sm text-gray-500">Potensi:</div>
                        <div className="text-lg font-medium text-gray-800">
                          {dataGempa.Potensi}
                        </div>
                      </div>
                    </motion.div>
                    {/* Map Section */}
                    <div className="border-t border-gray-200 pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800 flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                            />
                          </svg>
                          Peta Gempa
                        </h3>

                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${dataGempa.Coordinates}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors font-medium text-sm"
                        >
                          Lihat di Google Maps
                        </a>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.01 }}
                        className="relative rounded-xl border border-gray-200 shadow-lg overflow-hidden bg-white"
                      >
                        <img
                          src={`https://data.bmkg.go.id/DataMKG/TEWS/${dataGempa.Shakemap}`}
                          alt="Peta Gempa"
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
                          <div className="text-sm text-white font-medium">
                            Sumber: BMKG Indonesia
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-8 flex gap-4 relative z-10"
      >
        <Button
          onClick={fetchGempaData}
          className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full shadow-lg hover:shadow-xl flex items-center transition-all duration-300 font-medium text-lg group"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          <span className="relative flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2 animate-spin-slow"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Perbarui Data
          </span>
        </Button>
      </motion.div>

      <div className="mt-6 bg-white/80 backdrop-blur-md border border-blue-200 text-blue-700 p-3 px-6 rounded-full text-sm max-w-lg text-center shadow-lg relative z-10 hover:shadow-xl transition-shadow duration-300">
        <span className="text-blue-400 mr-2">⚡</span>
        Data gempa diperbarui secara otomatis setiap menit. Terakhir diperiksa:{" "}
        <span className="font-semibold bg-blue-50 px-2 py-1 rounded-full">
          {lastUpdate ? lastUpdate : "Belum ada data"}
        </span>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        limit={3}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        .glassmorphism {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
        }
        .magnitude-display {
          background-color: var(--magnitude-bg-color);
          color: var(--magnitude-text-color);
        }
      `}</style>
    </div>
  );
};

export default GempaBumiInfo;
