import { getToken } from "./api";

const BASE_URL=
"https://ecochainbackend-production.up.railway.app";

async function request(
path:string,
options:RequestInit={}
){

const token=getToken()

const response=await fetch(
`${BASE_URL}${path}`,
{
...options,

headers:{
"Content-Type":"application/json",

Authorization:
`Bearer ${token}`
}
}
)

if(!response.ok){

throw new Error(
"Something went wrong"
)

}

return response.json()

}


export const apiEstimateCost=(payload:any)=>
request(
  "/api/v1/cost/estimate",
  {
    method:"POST",
    body:JSON.stringify(payload)
  }
)

export const apiEstimateForm=(payload:{
  houseType: string
  country: string
  city: string
  size: number
  rooms: number
  ecoLevel: string
  powerPreference: string
  budget: number
  materials?: Record<string,string>
  features?: string[]
  budgetRange?: number[]
})=>
request(
  "/api/v1/cost/estimate-form/",
  {
    method:"POST",
    body:JSON.stringify(payload)
  }
)

export const apiTcoProjection=(payload:any)=>
request(
"/api/v1/cost/tco-projection",
{
method:"POST",
body:JSON.stringify(payload)
}
)

export const apiGetMaterials=(
country:string,
city:string,
category:string
)=>

request(
`/api/v1/pricing/materials?country=${country}&city=${city}&category=${category}`
)

export const apiGetLabourRates=(
country:string,
city:string
)=>

request(
`/api/v1/pricing/labour?country=${country}&city=${city}`
)

// export const apiDownloadReport=(layoutId:string)=>{

// window.open(

// `${BASE_URL}/api/v1/cost/report/${layoutId}?country=NG`,
// "_blank"

// )

// }

export const apiSaveEstimate = (payload: { form: any; result: any }) =>
  request("/api/v1/profile/saved-estimates", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const apiDownloadReport = (layoutId: string) => {
  window.open(
    `https://ecochainbackend-production.up.railway.app/api/v1/cost/report/${layoutId}?country=NG`,
    "_blank"
  );
};