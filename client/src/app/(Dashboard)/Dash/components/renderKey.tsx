'use client'
import { useState } from "react";
import { Check,Trash2,AlertCircle ,EyeOff,Eye,X} from "lucide-react";
import { Saveapikey } from "@/app/Api/renderApi";
import { useTheme } from '@/app/Context/ThemeContext';
import { useEmailStore } from "@/app/Store/storeEmail";
import { renderAPiStore } from "@/app/Store/storeApi";
export const RenderKeys = () => {
     const { isDarkMode } = useTheme();
  const [renderKeyValid, setRenderKeyValid] = useState(null);
  const [showRenderKey, setShowRenderKey] = useState(false);
  const [renderApiKey, setRenderApiKey] = useState('');
  const [showUptimeKey, setShowUptimeKey] = useState(false);
  const [uptimeApiKey, setUptimeApiKey] = useState('');
  const [uptimeKeyValid, setUptimeKeyValid] = useState(null);
  const [uptimeFilter, setUptimeFilter] = useState('all');
  const EmailStore=useEmailStore();
  const RenderApi=renderAPiStore();
''  
 
  const handleSaveRenderKey = async (key:string) => {
  try {
    const email=EmailStore.email || 'tanmayjoshi072@gmail.com';

    const result = await Saveapikey(key,email);
    if(result.data.Success){
      RenderApi.setApi(key)   // Here api key is set for the further use
    }
  } catch (error) {
    console.error(error);
  }
};

    return(

    <div className="space-y-6">
      <p className="text-gray-600 dark:text-gray-400">Manage your API keys for external services</p>

      <div className={`rounded-2xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Render API Key</h3>
          {renderKeyValid !== null && (
            <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              renderKeyValid ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {renderKeyValid ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              {renderKeyValid ? 'Valid' : 'Invalid'}
            </span>
          )}
        </div>
        <div className="space-y-4">
          <div className="relative">
            <input
              type={showRenderKey ? 'text' : 'password'}
              value={renderApiKey}
              onChange={(e) => setRenderApiKey(e.target.value)}
              placeholder="Enter Render API key"
              className={`w-full px-4 py-3 pr-12 border rounded-lg ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
            />
            <button
              onClick={() => setShowRenderKey(!showRenderKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            >
              {showRenderKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex gap-3">
            <button onClick={()=>{handleSaveRenderKey(renderApiKey)}}
             className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
            >
              Save Key
            </button>
            <button 
              
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 constext-white rounded-lg transition-colors"
            >
              Test Key
            </button>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">UptimeRobot API Key</h3>
          {uptimeKeyValid !== null && (
            <span className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              uptimeKeyValid ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {uptimeKeyValid ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              {uptimeKeyValid ? 'Valid' : 'Invalid'}
            </span>
          )}
        </div>
        <div className="space-y-4">
          <div className="relative">
            <input
              type={showUptimeKey ? 'text' : 'password'}
              value={uptimeApiKey}
              onChange={(e) => setUptimeApiKey(e.target.value)}
              placeholder="Enter UptimeRobot API key"
              className={`w-full px-4 py-3 pr-12 border rounded-lg ${
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'
              } focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
            />
            <button
              onClick={() => setShowUptimeKey(!showUptimeKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
            >
              {showUptimeKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors">
              Save Key
            </button>
            <button 
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Test Key
            </button>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      <div className={`rounded-2xl shadow-md p-6 ${isDarkMode ? 'bg-gray-800 border-yellow-500' : 'bg-yellow-50 border-yellow-300'} border-2`}>
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-1">Security Notice</h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              API keys are stored securely and encrypted. Never share your API keys with others. 
              Test your keys regularly to ensure they remain valid.
            </p>
          </div>
        </div>
      </div>
    </div>
    )
}
    
