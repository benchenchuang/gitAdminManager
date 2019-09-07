import {baseUrl} from '@/api/axios';
export default{
    getApplyList:`${baseUrl}/V2.0/enterprise/export`,
    getCircleList:`${baseUrl}/V2.0/manager/export`,
    getFinacelList:`${baseUrl}/V2.0/distribution/exportWithdrawalRecord`,
    exportSearch:`${baseUrl}/V2.0/cream/exportCreamSearch`,
    exportDistributors:`${baseUrl}/V2.0/distribution/exportDistributors`,
    // exportExcelByUserInfo:(type)=>`${baseUrl}/V2.0/order/exportExcelByUserInfo/${type}`
    exportExcelByUserInfo:`${baseUrl}/V2.0/order/exportExcelByUserInfo`,
    exportSong:`${baseUrl}/V2.0/mgMadForSong/export`
}