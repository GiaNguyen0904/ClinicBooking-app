import axios from "axios";

const API_BASE_URL = "http://10.106.39.177:5555";

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

const getData = async (request) => {
    const response = await request;
    return response.data;
};

const clinicApi = {
    login: (payload) => {
        return getData(apiClient.post("/login", payload));
    },

    registerPatient: (payload) => {
        return getData(apiClient.post("/TaoTaiKhoanKH", payload));
    },

    createDoctor: (payload) => {
        return getData(apiClient.post("/register-bacsi", payload));
    },

    registerDoctor: (payload) => {
        return getData(apiClient.post("/register-bacsi", payload));
    },

    updateDoctor: (maTaiKhoan, payload) => {
        return getData(apiClient.put(`/bacsi/${maTaiKhoan}`, payload));
    },

    deleteDoctor: (maTaiKhoan) => {
        return getData(apiClient.delete(`/bacsi/${maTaiKhoan}`));
    },

    getAccounts: () => {
        return getData(apiClient.get("/taikhoan"));
    },

    getDoctorAccounts: () => {
        return getData(apiClient.get("/api/bacsi-taikhoan"));
    },

    getAppointments: () => {
        return getData(apiClient.get("/lichhen"));
    },

    getPatientStats: () => {
        return getData(apiClient.get("/ThongKeSoLichHenCuaBenNhanGiamTheoMaBenhNhan"));
    },

    getServiceStats: () => {
        return getData(apiClient.get("/ThongKeDichVuDuocSuDungNhieuNhatGiamMDV"));
    },

    getDoctorStats: () => {
        return getData(apiClient.get("/ThongKeLichHenGiamTheoBacSi"));
    },

    getTimeSlotStats: () => {
        return getData(apiClient.get("/KhungGioDuocDatNhieuNhatGiamTheoKhungGio"));
    }
};

export default clinicApi;